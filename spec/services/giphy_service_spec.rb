require 'rails_helper'

RSpec.describe GiphyService do
  let(:giphy_item) do
    {
      "id" => "abc123",
      "title" => "Happy dance",
      "images" => {
        "fixed_width_small" => { "url" => "https://media1.giphy.com/media/abc123/100w.gif", "width" => "100", "height" => "80" },
        "fixed_width" => { "url" => "https://media1.giphy.com/media/abc123/200w.gif", "width" => "200", "height" => "160" }
      }
    }
  end
  let(:body) { { "data" => [giphy_item, { "id" => "no_images" }], "pagination" => { "offset" => 0, "count" => 2, "total_count" => 50 } } }
  let(:http) { instance_double(Net::HTTP) }
  let(:response) { Net::HTTPOK.new("1.1", "200", "OK") }

  before do
    stub_const("ENV", ENV.to_h.merge("GIPHY_API_KEY" => "test-key"))
    allow(response).to receive(:body) { body.to_json }
    allow(http).to receive(:get).and_return(response)
    allow(Net::HTTP).to receive(:start).and_yield(http)
    allow(Rails.cache).to receive(:fetch).and_yield
  end

  it "returns only the fields the picker needs and skips items without images" do
    result = described_class.search(kind: "gifs", query: "dance", offset: 0)

    expect(result[:results]).to eq([{
      id: "abc123",
      title: "Happy dance",
      preview_url: "https://media1.giphy.com/media/abc123/100w.gif",
      url: "https://media1.giphy.com/media/abc123/200w.gif",
      width: 200,
      height: 160
    }])
    expect(result[:next_offset]).to eq(2)
  end

  it "searches when there is a query and shows trending otherwise" do
    described_class.search(kind: "stickers", query: "hi", offset: 0)
    expect(http).to have_received(:get).with(a_string_starting_with("/v1/stickers/search?").and(including("q=hi")))

    described_class.search(kind: "stickers", query: "  ", offset: 0)
    expect(http).to have_received(:get).with(a_string_starting_with("/v1/stickers/trending?"))
  end

  it "falls back to GIFs for an unknown kind" do
    described_class.search(kind: "../users", query: "", offset: 0)
    expect(http).to have_received(:get).with(a_string_starting_with("/v1/gifs/trending?"))
  end

  it "stops paging at the last result" do
    body["pagination"] = { "offset" => 48, "count" => 2, "total_count" => 50 }
    expect(described_class.search(kind: "gifs", query: "", offset: 48)[:next_offset]).to be_nil
  end

  it "raises an error when Giphy fails" do
    allow(http).to receive(:get).and_return(Net::HTTPTooManyRequests.new("1.1", "429", "Too Many Requests"))
    expect { described_class.search(kind: "gifs", query: "", offset: 0) }.to raise_error(GiphyService::Error)
  end

  it "raises an error when the API key is missing" do
    stub_const("ENV", ENV.to_h.except("GIPHY_API_KEY"))
    expect { described_class.search(kind: "gifs", query: "", offset: 0) }.to raise_error(GiphyService::Error, /GIPHY_API_KEY/)
  end
end

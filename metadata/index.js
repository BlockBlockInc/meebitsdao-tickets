function redTicketMetadata(seriesId) {
  return {
    name: `Red Ticket #${seriesId}`,
    description:
      "MeebitsDAO and Divergence Ventures present: Dissect the Dissected – This Red ticket entitles the holder to participate in the RED EVENT, a live prize draw for Dissected shard rewards (Symbol: DSMB).  Winning tickets must claim the reward within 30 days of the live draw event & announcement of winners.",
    image: "ipfs://QmYNAkKi4AhiFeknPrnUPxAJTrZ3KgfjF2QHDpjq7DHxfH",
    attributes: [
      {
        trait_type: "Artist",
        value: "Waxbones",
      },
      {
        trait_type: "Series",
        value: "Red",
      },
      {
        trait_type: "Series 001 ID",
        display_type: "number",
        value: `${seriesId}`,
      },
    ],
  };
}

module.exports = {
  redTicketMetadata,
};

import { describe, expect, it } from "bun:test";
import { getIconSuggestion } from "../src/types/deck";

describe("getIconSuggestion", () => {
  it("returns chart for data keywords", () => {
    expect(getIconSuggestion("Sales Data")).toBe("chart");
    expect(getIconSuggestion("Annual graph report")).toBe("chart");
  });

  it("returns users for team keywords", () => {
    expect(getIconSuggestion("Our Team")).toBe("users");
    expect(getIconSuggestion("Group collaboration", "people working"))
      .toBe("users");
  });

  it("returns trending-up for growth keywords", () => {
    expect(getIconSuggestion("Yearly growth forecast")).toBe("trending-up");
  });

  it("returns target for goal keywords", () => {
    expect(getIconSuggestion("Project Target")).toBe("target");
  });

  it("returns map for strategy keywords", () => {
    expect(getIconSuggestion("Product roadmap")).toBe("map");
  });

  it("returns lightbulb for innovation keywords", () => {
    expect(getIconSuggestion("Creative Idea Session")).toBe("lightbulb");
  });

  it("returns message-circle for communication keywords", () => {
    expect(getIconSuggestion("Client communication", "talk"))
      .toBe("message-circle");
  });

  it("returns shield for security keywords", () => {
    expect(getIconSuggestion("Security measures")).toBe("shield");
  });

  it("returns clock for time keywords", () => {
    expect(getIconSuggestion("Schedule overview")).toBe("clock");
  });

  it("returns dollar-sign for money keywords", () => {
    expect(getIconSuggestion("Revenue forecast")).toBe("dollar-sign");
  });

  it("defaults to presentation when no keywords match", () => {
    expect(getIconSuggestion("Random topic")).toBe("presentation");
  });
});

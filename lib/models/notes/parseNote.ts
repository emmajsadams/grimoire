import { Note } from "thin-backend";
import { TextNode } from "lexical";

// TODO: Move this to some constants file
const DONE = "done";
const TODO = "todo";
const STATUSES = [DONE, TODO];
const STATUS_PROPERTY = "status";

const TITLE_PROPERTY = "title";

// TODO: Add Parser for `Due: ....`
// TODO: Add Parser for `Tags: ....`
// TODO: Add Parser for `Recurring: Weekly|Monthly`
export function parseNote(textNodes: TextNode[]): Partial<Note> {
  const note: Partial<Note> = {
    title: "",
    description: "",
    status: "",
    error: "",
  };

  if (textNodes.length > 0) {
    for (const textNode of textNodes) {
      const textContent = textNode.getTextContent();
      const lowerCaseTextContent = textContent.toLowerCase();

      let isProperty = parseProperty(
        STATUS_PROPERTY,
        lowerCaseTextContent,
        note,
        (propertyText) =>
          STATUSES.includes(propertyText)
            ? ""
            : `${propertyText} is not a valid status (${STATUSES.join(",")}).`
      );
      if (isProperty) {
        continue;
      }

      isProperty = parseProperty(
        TITLE_PROPERTY,
        lowerCaseTextContent,
        note,
        (_) => "" // all text is valid as a title
      );
      if (isProperty) {
        continue;
      }

      note.description += textContent + " \n ";
    }
  }

  return note;
}

// Returns true if the text contains the property (but not necessarily if it successfully parsed it since note.error is for that.)
function parseProperty(
  property: string,
  lowerCaseTextContent: string,
  note: Partial<Note>,
  validate: (value: string) => string
): boolean {
  if (!lowerCaseTextContent.startsWith(`${property}:`)) {
    return false;
  }

  // If the property is already set that means multiple of the same properties were added to the same note
  // which is not allowed.
  if ((note as any)[property]) {
    note.error += `${property} is already set.`;
    return true;
  }

  // Check if the property text is in the acceptable format
  const propertyText = lowerCaseTextContent.replace(`${property}:`, "").trim();
  const error = validate(propertyText);
  if (error) {
    note.error += error;
  }

  // Finally set the property
  (note as any)[property] = propertyText;

  return true;
}
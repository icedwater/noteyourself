import { CustomEditor, CustomElement } from "../Core";
import classNames from "classnames";

export type ElementMaker = (props: {
  element: CustomElement;
  attributes: any;
  children: any;
  text: string;
  editor: CustomEditor;
}) => JSX.Element | undefined;

const SlateElement = ({
  element,
  attributes,
  children,
  quote,
  img,
  elementMakers,
  text,
  editor,
}: {
  attributes: any;
  children: any;
  element: CustomElement;
  elementMakers: ElementMaker[];
  quote?: boolean;
  img?: {
    url?: string;
    uri?: string;
  };
  text: string;
  editor: CustomEditor;
}) => {
  for (const maker of elementMakers) {
    const ret = maker({ element, attributes, children, text, editor });
    if (ret) {
      return ret;
    }
  }

  if (element.type === "code-block") {
    return (
      <pre
        {...attributes}
        className="mb-4 bg-primary bg-opacity-5 p-4 rounded-md whitespace-break-spaces"
        spellCheck={false}
      >
        {children}
      </pre>
    );
  }

  return (
    <>
      {img?.url && (
        <div
          style={{ userSelect: "none" }}
          contentEditable={false}
          className="flex flex-col items-center w-full"
        >
          <img
            src={img.uri || img.url}
            className="rounded-lg"
            alt="RetroNote"
          />
        </div>
      )}
      <p
        {...attributes}
        className={classNames({
          "px-6 bg-primary bg-opacity-10 py-2 italic": quote,
          "border-l-4 border-primary border-opacity-30": quote,
          "mb-2": !quote,
        })}
      >
        <span
          className={classNames({
            "py-2 text-center text-sm block opacity-50 break-all": img?.url,
          })}
        >
          {children}
        </span>
      </p>
    </>
  );
};

export default SlateElement;

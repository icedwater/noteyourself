import classNames from "classnames";
import { PropsWithChildren, createContext, useContext } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

type ContextType = {
  active?: boolean;
  onToggle: () => void;
};

const Context = createContext({} as ContextType);

const Collapsible = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

const Item = ({
  children,
  active,
  handleToggle,
}: PropsWithChildren & {
  active: boolean;
  handleToggle: () => void;
}) => {
  return (
    <Context.Provider value={{ active, onToggle: handleToggle }}>
      {children}
    </Context.Provider>
  );
};

const Label = ({ children }: PropsWithChildren) => {
  const { active, onToggle } = useContext(Context);
  return (
    <div
      className={classNames(
        "flex items-center font-semibold",
        "px-2 py-1 text-sm bg-primary bg-opacity-0",
        "rounded hover:bg-opacity-10 active:bg-opacity-20",
        "cursor-pointer"
      )}
      onClick={() => {
        onToggle();
      }}
    >
      <span>{children}</span>
      <span className="text-xl opacity-50">
        {active ? <BiChevronUp /> : <BiChevronDown />}
      </span>
    </div>
  );
};

const Content = ({ children }: PropsWithChildren) => {
  const { active } = useContext(Context);

  return (
    <div
      className={classNames("overflow-hidden transition-all pl-3", {
        "max-h-0": !active,
        "max-h-[10000000px]": active,
      })}
    >
      {children}
    </div>
  );
};

Item.Label = Label;
Item.Content = Content;
Collapsible.Item = Item;

export default Collapsible;

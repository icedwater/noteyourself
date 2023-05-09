import classNames from "classnames";
import { useContext } from "react";
import { AppContext } from "../components/AppContext";

const TextBlock = ({ height }: { height: number }) => {
  return (
    <div
      className="w-full bg-primary-700 bg-opacity-30 rounded-md"
      style={{ height }}
    />
  );
};

const GoalOption = ({
  blocks,
  title,
  active,
}: {
  blocks: number[];
  title: string;
  active?: boolean;
}) => {
  return (
    <div
      className={classNames(
        "w-[100px] h-[100px] bg-primary-700 bg-opacity-10 rounded p-2 flex flex-col justify-between text-sm items-center",
        "cursor-pointer",
        { "outline outline-2": active }
      )}
    >
      <div className="w-full space-y-1">
        {blocks.map((block, i) => (
          <TextBlock key={i} height={block} />
        ))}
      </div>
      {title}
    </div>
  );
};

const Goal = () => {
  const { settings, saveSettings } = useContext(AppContext);

  const handleClick = (val: string) => {
    saveSettings({ ...settings, goal: val || undefined });
  };

  return (
    <div>
      <h3 className="text-lg mb-1">Write goal</h3>
      <div className="space-y-4">
        <ul className="flex space-x-4">
          <li onClick={() => handleClick("")}>
            <GoalOption
              title="free style"
              blocks={[]}
              active={settings.goal === undefined}
            />
          </li>
          <li onClick={() => handleClick("short")}>
            <GoalOption
              title="short"
              blocks={[20]}
              active={settings.goal === "short"}
            />
          </li>
        </ul>
        <ul className="flex space-x-4">
          <li onClick={() => handleClick("medium")}>
            <GoalOption
              title="medium"
              blocks={[20, 10]}
              active={settings.goal === "medium"}
            />
          </li>
          <li onClick={() => handleClick("long")}>
            <GoalOption
              title="long"
              blocks={[20, 10, 20]}
              active={settings.goal === "long"}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Goal;
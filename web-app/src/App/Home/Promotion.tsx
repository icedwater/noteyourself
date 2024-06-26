import { ComponentProps } from "react";
import { RxTwitterLogo, RxEnvelopeClosed, RxDiscordLogo } from "react-icons/rx";

const SocialIcon = ({ children, ...restProps }: ComponentProps<"a">) => {
  return (
    <a
      className="opacity-40 hover:opacity-100 transition-all cursor-pointer"
      {...restProps}
    >
      {children}
    </a>
  );
};

const Promotion = () => {
  return (
    <div>
      {/* Built by */}
      {/* <div className="mt-2 px-2">
        <span className="opacity-40">Built by </span>
        <a
          className="opacity-40 hover:opacity-100 underline"
          href="https://twitter.com/@pramodk73"
          target="_blank"
          rel="noreferrer"
        >
          @pramodk73
        </a>
      </div> */}

      {/* Community */}
      <div className="mb-2 px-2 text-3xl flex items-center space-x-6">
        <SocialIcon href="https://twitter.com/retronote_app" target="_blank">
          <RxTwitterLogo />
        </SocialIcon>
        <SocialIcon href="mailto:help@retronote.app">
          <RxEnvelopeClosed />
        </SocialIcon>
        <SocialIcon href="https://discord.gg/wqThG6K5f" target="_blank">
          <RxDiscordLogo />
        </SocialIcon>
        <div className="flex justify-center items-center">
          <a
            className="text-sm"
            href="https://forms.gle/YKSbYg7raWEeyvqP7"
            target="_blank"
            rel="noreferrer"
          >
            Provide feedback
          </a>
        </div>
      </div>
    </div>
  );
};

export default Promotion;

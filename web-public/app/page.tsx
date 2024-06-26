"use client";
import LinkButton from "@/components/NewLanding/Button";
import FAQ from "@/components/NewLanding/FAQ";
import Highlight from "@/components/NewLanding/Highlight";
import Title from "@/components/NewLanding/Title";
import UseCase from "@/components/NewLanding/UseCase";
import classNames from "classnames";
import React from "react";
import { ComponentProps, useEffect, useState } from "react";
import {
  BiBookContent,
  BiChevronLeft,
  BiChevronRight,
  BiCodeAlt,
  BiExport,
  BiHash,
  BiImage,
  BiLink,
  BiLock,
  BiMath,
  BiSearchAlt,
  BiShareAlt,
} from "react-icons/bi";
import { BsMarkdownFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { RxTwitterLogo, RxDiscordLogo } from "react-icons/rx";
import { Courier } from "@/components/font";
import Event from "@/components/Event";

const P = ({ className, children, ...restProps }: ComponentProps<"p">) => {
  return (
    <p
      className={twMerge(className, "text-xl max-w-lg text-center font-light")}
      {...restProps}
    >
      {children}
    </p>
  );
};

const SocialLink = ({ children, ...restProps }: ComponentProps<"span">) => {
  return (
    <span
      className={classNames(
        "text-primary-700 text-opacity-50",
        "hover:text-opacity-100"
      )}
      {...restProps}
    >
      {children}
    </span>
  );
};

const usecases = [
  { prefix: "For all your", highlight: "academic", postfix: "needs!" },
  { prefix: "For all your", highlight: "research", postfix: "needs!" },
  { prefix: "For all your", highlight: "blogging", postfix: "needs!" },
  { prefix: "For all your", highlight: "writing", postfix: "needs!" },
];

const NewLandingPage = () => {
  const [activeItem, setActiveItem] = useState<string>();
  const [activeUsecase, setActiveUsecase] = useState(0);

  const handleUsecaseClick = ({ prev }: { prev?: boolean }) => {
    let next = activeUsecase + 1;
    if (prev) {
      next = activeUsecase - 1;
    }
    if (next < 0) {
      next = usecases.length - 1;
    } else if (next > usecases.length - 1) {
      next = 0;
    }
    setActiveUsecase(next);
  };

  return (
    <div className="bg-base text-primary-700">
      <Event name="landing_page" />
      <nav
        className={classNames(
          "w-full mb-14 py-2",
          "border-b border-primary-700 border-opacity-10",
          "flex justify-center",
          "bg-base sticky top-0 z-20",
          "px-2 md:px-0"
        )}
      >
        <div
          className={classNames(
            "flex justify-between",
            "max-w-[1000px] w-full"
          )}
        >
          <div
            className={classNames(
              "text-4xl italic flex items-center space-x-4",
              Courier.className
            )}
          >
            <img src="/og.png" className="w-14 h-14" alt="RetroNote" />
            <span className="mt-2">RetroNote</span>
          </div>
          <ul
            className={classNames("space-x-10 items-center", "hidden lg:flex")}
          >
            <li>
              <a href="#use-cases" className="hover:underline">
                Use cases
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:underline">
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="flex flex-col items-center px-4 lg:px-0">
        <Title>
          Writing made <Highlight>easy</Highlight> for the web!
        </Title>

        <P className="py-4">
          A simple markdown based writing app that let’s you write and port to
          all other requirements
        </P>

        <p className="py-8">
          <LinkButton href="https://app.retronote.app/write">
            Start writing
          </LinkButton>
          <P className="mt-2">No login required</P>
        </p>

        <p className="max-w-[1000px] py-10">
          <img
            src="/preview.webp"
            className="rounded-lg"
            style={{ boxShadow: "0px 0px 37px 0px rgba(0, 0, 0, 0.25)" }}
            alt="RetroNote - A simple web based note taking app"
          />
        </p>

        <div id="use-cases">
          {usecases.map((usecase, i) => (
            <Title
              key={i}
              className={classNames("mt-24 mb-14", {
                hidden: activeUsecase !== i,
              })}
            >
              {usecase.prefix}{" "}
              <div className="whitespace-nowrap inline-block">
                <Highlight.NavBtn
                  left
                  onClick={() => handleUsecaseClick({ prev: true })}
                >
                  <BiChevronLeft className="inline" />
                </Highlight.NavBtn>
                <Highlight
                  bottom={-10}
                  className="cursor-pointer w-56 md:w-80 inline-block text-center"
                  onClick={() => handleUsecaseClick({})}
                >
                  {usecase.highlight}
                </Highlight>
                <Highlight.NavBtn right onClick={() => handleUsecaseClick({})}>
                  <BiChevronRight className="inline" />
                </Highlight.NavBtn>
              </div>{" "}
              {usecase.postfix}
            </Title>
          ))}
        </div>

        <UseCase.Container>
          <UseCase.Items>
            <li
              onClick={() => setActiveItem("organize")}
              className={classNames({
                hidden: !["academic"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiHash />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Organize</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Group the notes easily by just using hashtags. You can use
                    &quot;/&quot; to event nest them!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("link-notes")}
              className={classNames({
                hidden: !["academic", "research", "writing"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiLink />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Link notes</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Link the notes by just wrapping the words inside [[]]. Helps
                    in building map of thoughts!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("search")}
              className={classNames({
                hidden: !["academic"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiSearchAlt />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Search</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Quickly search the notes across the collection right from
                    the navigation menu!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("outline")}
              className={classNames({
                hidden: !["academic"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiBookContent />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Outline</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Have a mini map of the notes in the form of outline using
                    headings.
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("e2e")}
              className={classNames({
                hidden: !["research", "writing"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiLock />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>E2E encryption</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    All your notes are end to end encrypted even when they are
                    synced across devices!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("images")}
              className={classNames({
                hidden: !["research", "blogging"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiImage />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Images</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    You can quickly add images to your notes by either drag and
                    drop or copy and paste!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("code")}
              className={classNames({
                hidden: !["blogging"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiCodeAlt />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Code blocks</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Insert code blocks with syntax highlighting with standard
                    markdown!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("markdown")}
              className={classNames({
                hidden: !["blogging", "writing"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BsMarkdownFill />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Pure markdown</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Use markdown to format the notes. No proprietary format, no
                    lock in!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("export")}
              className={classNames({
                hidden: !["writing"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiExport />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Full export</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Your notes are always yours! You can export all your notes
                    with one shortcut!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("math")}
              className={classNames({
                hidden: !["research"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiMath />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Math expressions</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Use LaTeX syntax to insert math expressions. Just wrap them
                    inside $$!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>

            <li
              onClick={() => setActiveItem("share")}
              className={classNames({
                hidden: !["blogging"].includes(
                  usecases[activeUsecase].highlight
                ),
              })}
            >
              <UseCase.Item>
                <UseCase.Item.Icon>
                  <BiShareAlt />
                </UseCase.Item.Icon>
                <UseCase.Item.Content>
                  <UseCase.Item.Title>Quick share</UseCase.Item.Title>
                  <UseCase.Item.Description>
                    Share your notes quickly with public right from the app!
                  </UseCase.Item.Description>
                </UseCase.Item.Content>
              </UseCase.Item>
            </li>
          </UseCase.Items>
        </UseCase.Container>

        <Title className="mt-24 mb-14" id="faq">
          FAQ
        </Title>

        <div className="space-y-2 max-w-[1000px]">
          <FAQ
            question="What is RetroNote?"
            answer="RetroNote is a note taking app. These notes can be your daily journals, research notes, book writing, to-dos, academic notes, blog posts, etc."
          />
          <FAQ
            question="How is RetroNote different from other apps?"
            answer="RetroNote stands out for its simplicity and no overwhelming features. It local-first and provides distraction free environment for your writing activity without any lock in."
          />
          <FAQ
            question="How do I install the app?"
            answer="RetroNote is a web app. The app runs completely on your browser. You can install as PWA as well and it runs like a native application."
          />
          <FAQ
            question="Where are my notes stored?"
            answer="All your notes are stored on your browser itself. If you enable multi-device sync, the notes are copied to our sync servers in encrypted form."
          />
          <FAQ
            question="How secured my notes are?"
            answer="Your notes are completely end to end encrypted. Even when they are copied to sync servers, they are encrypted and RetroNote and the team has no way to read the notes."
          />
        </div>

        <div className="my-24">
          <LinkButton href="https://app.retronote.app/write">
            Start writing
          </LinkButton>
          <P className="mt-2">No login required</P>
        </div>

        <div
          className={classNames(
            "max-w-[400px] w-full flex justify-between items-center mb-10",
            "flex-col lg:flex-row space-y-4 lg:space-y-0"
          )}
        >
          <div className={classNames("text-3xl flex space-x-4")}>
            <a
              href="https://twitter.com/retronote_app"
              target="_blank"
              rel="noreferrer"
            >
              <SocialLink>
                <RxTwitterLogo />
              </SocialLink>
            </a>
            <a
              href="https://discord.gg/KS9khUH9m3"
              target="_blank"
              rel="noreferrer"
            >
              <SocialLink>
                <RxDiscordLogo />
              </SocialLink>
            </a>
          </div>
          <div className="space-x-4">
            <a href="/terms" rel="noreferrer">
              <SocialLink>Terms</SocialLink>
            </a>
            <a href="/policy" rel="noreferrer">
              <SocialLink>Policy</SocialLink>
            </a>
            <span className="text-primary-700 text-opacity-50">
              Built by{" "}
              <a href="https://twitter.com/pramodk73" rel="noreferrer">
                <SocialLink>@pramodk73</SocialLink>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLandingPage;

import React from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

import CenteredNavbar from "./centered-navbar";
import ScrollingBanner from "./scrolling-banner";
import {
  Logo1,
  Logo10,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo6,
  Logo7,
  Logo8,
  Logo9,
} from "./logos";

const logos = [
  {
    key: "logo-1",
    logo: Logo1,
  },
  {
    key: "logo-2",
    logo: Logo2,
  },
  {
    key: "logo-3",
    logo: Logo3,
  },
  {
    key: "logo-4",
    logo: Logo4,
  },
  {
    key: "logo-5",
    logo: Logo5,
  },
  {
    key: "logo-6",
    logo: Logo6,
  },
  {
    key: "logo-7",
    logo: Logo7,
  },
  {
    key: "logo-8",
    logo: Logo8,
  },
  {
    key: "logo-9",
    logo: Logo9,
  },
  {
    key: "logo-10",
    logo: Logo10,
  },
];

export default function Component() {
  return (
    <div className="relative z-auto flex h-screen min-h-dvh w-full flex-col gap-9 overflow-y-auto bg-background p-4 md:gap-12 md:px-10 md:py-[34px]">
      {/* bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 */}
      <div
        className={
          "absolute w-full h-full inset-0 z-10 bg-gradient-to-tr from-[#ffffff] to-[#9089fc50] opacity-30 blur-[30px]"
        }
      />
      <main
        className={
          "flex flex-col items-center rounded-2xl bg-hero-section-centered-navbar px-3 md:rounded-3xl md:px-0 hero-bg "
        }
      >
        <section className="my-14 mt-16 flex flex-col items-center justify-center gap-6">
          <CenteredNavbar />
          <LazyMotion features={domAnimation}>
            <m.div
              animate="kick"
              className="flex flex-col gap-6"
              exit="auto"
              initial="auto"
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              variants={{
                auto: { width: "auto" },
                kick: { width: "auto" },
              }}
            >
              <AnimatePresence mode="wait">
                <h1 className="text-center text-[clamp(2.125rem,1.142rem+3.659vw,4rem)] font-bold leading-none text-foreground">
                  访问AI模型
                </h1>
                <m.div
                  animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                  className="text-start text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]"
                  initial={{ filter: "blur(16px)", opacity: 0, x: 15 + 1 * 2 }}
                  transition={{
                    bounce: 0,
                    delay: 0.01 * 10,
                    duration: 0.8 + 0.1 * 8,
                    type: "spring",
                  }}
                >
                  <h1 className="flex gap-5 text-center text-[clamp(2.125rem,1.142rem+3.659vw,4rem)] font-bold leading-none">
                    <span className={"text-primary"}>轻松</span>
                    <span className={"text-primary"}>便宜</span>
                    <span className={""}>and</span>
                    <span className={"text-primary"}>快速.</span>
                  </h1>
                </m.div>

                <m.div
                  animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                  className="text-start font-normal leading-7 text-default-500 sm:text-[18px]"
                  initial={{ filter: "blur(16px)", opacity: 0, x: 15 + 1 * 3 }}
                  transition={{
                    bounce: 0,
                    delay: 0.01 * 30,
                    duration: 0.8 + 0.1 * 9,
                    type: "spring",
                  }}
                >
                  <p className="text-center text-base text-default-500 sm:w-[666px] md:text-lg md:leading-6">
                    致力于为开发者提供快速、便捷的 API
                    接口调用方案，打造稳定且易于使用的 API
                    接口平台，一站式集成几乎所有AI大模型
                  </p>
                </m.div>
              </AnimatePresence>
            </m.div>
          </LazyMotion>
        </section>
      </main>
      <div className="mx-auto w-full max-w-6xl px-3 lg:px-6">
        <ScrollingBanner hideScrollBar shouldPauseOnHover gap="40px" size={40}>
          {logos.map(({ key, logo }) => (
            <div
              key={key}
              className="flex items-center justify-center text-default-500"
            >
              {logo}
            </div>
          ))}
        </ScrollingBanner>
      </div>
    </div>
  );
}

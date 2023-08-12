import { defer } from "@remix-run/node";
import type { V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { motion, useInView } from "framer-motion";
import { useInView as observerUseInView } from "react-intersection-observer";
import { Suspense, useEffect, useRef } from "react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const pikachuQuery = fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
  const dittoQuery = new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetch("https://pokeapi.co/api/v2/pokemon/ditto"));
    }, 1000);
  });
  const squirtleQuery = new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetch("https://pokeapi.co/api/v2/pokemon/squirtle"));
    }, 1500);
  });

  const pikachu = await pikachuQuery.then((res: any) => res.json());
  const ditto = dittoQuery.then((res: any) => res.json());
  const squirtle = squirtleQuery.then((res: any) => res.json());

  return defer({ pikachu, ditto, squirtle });
};

export default function Index() {
  const { pikachu, ditto, squirtle } = useLoaderData();

  // framer-motion useInView, no suspense
  const pikachuRef = useRef(null);
  const pikachuIsInView = useInView(pikachuRef, {
    once: true,
  });
  useEffect(() => {
    console.log("pikachuIsInView", pikachuIsInView);
  }, [pikachuIsInView]);

  // framer-motion useInView, suspense
  const dittoRef = useRef(null);
  const dittoIsInView = useInView(dittoRef, {
    once: true,
  });
  useEffect(() => {
    console.log("dittoIsInView", dittoIsInView);
  }, [dittoIsInView]);

  // react-intersection-observer useInView, suspense
  const { ref: squirtleRef, inView: squirtleIsInView } = observerUseInView({
    triggerOnce: true,
  });
  useEffect(() => {
    console.log("squirtleIsInView", squirtleIsInView);
  }, [squirtleIsInView]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Pokemon</h1>
      {/* framer-motion useInView, no suspense */}
      <motion.div
        ref={pikachuRef}
        animate={pikachuIsInView ? { translateX: 0 } : { translateX: 300 }}
        transition={{ duration: 0.25 }}
      >
        <h2>{pikachu.name}</h2>
        <img src={pikachu.sprites.front_default} alt="pikachu" />
      </motion.div>
      {/* framer-motion useInView, suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={ditto}>
          {(ditto: any) => (
            <motion.div
              ref={dittoRef}
              animate={dittoIsInView ? { translateX: 0 } : { translateX: 300 }}
              transition={{ duration: 0.25 }}
            >
              <h2>{ditto.name}</h2>
              <img src={ditto.sprites.front_default} alt="ditto" />
            </motion.div>
          )}
        </Await>
      </Suspense>
      {/* react-intersection-observer useInView, suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={squirtle}>
          {(squirtle: any) => (
            <motion.div
              ref={squirtleRef}
              animate={
                squirtleIsInView ? { translateX: 0 } : { translateX: 300 }
              }
              transition={{ duration: 0.25 }}
            >
              <h2>{squirtle.name}</h2>
              <img src={squirtle.sprites.front_default} alt="squirtle" />
            </motion.div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

import { type V2_MetaFunction, type LoaderArgs, defer } from "@remix-run/node";
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
  const charmanderQuery = fetch("https://pokeapi.co/api/v2/pokemon/charmander");
  const dittoQuery = new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetch("https://pokeapi.co/api/v2/pokemon/ditto"));
    }, 1000);
  });
  const squirtleQuery = new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetch("https://pokeapi.co/api/v2/pokemon/squirtle"));
    }, 2000);
  });

  const pikachu = await pikachuQuery.then((res) => res.json());
  const charmander = charmanderQuery.then((res) => res.json());
  const ditto = dittoQuery.then((res: any) => res.json());
  const squirtle = squirtleQuery.then((res: any) => res.json());

  return defer({ pikachu, charmander, ditto, squirtle });
};

export default function Index() {
  const { pikachu, charmander, ditto, squirtle } = useLoaderData();

  const pikachuRef = useRef(null);
  const pikachuIsInView = useInView(pikachuRef, {
    once: true,
  });
  useEffect(() => {
    console.log("pikachuIsInView", pikachuIsInView);
  }, [pikachuIsInView]);

  const charmanderRef = useRef(null);
  const charmanderIsInView = useInView(charmanderRef, {
    once: true,
  });
  useEffect(() => {
    console.log("charmanderIsInView", charmanderIsInView);
  }, [charmanderIsInView]);

  const dittoRef = useRef(null);
  const dittoIsInView = useInView(dittoRef, {
    once: true,
  });
  useEffect(() => {
    console.log("dittoIsInView", dittoIsInView);
  }, [dittoIsInView]);

  const { ref: squirtleRef, inView: squirtleIsInView } = observerUseInView({
    triggerOnce: true,
  });
  useEffect(() => {
    console.log("squirtleIsInView", squirtleIsInView);
  }, [squirtleIsInView]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Pokemon</h1>
      {/* no suspense */}
      <motion.div
        ref={pikachuRef}
        animate={pikachuIsInView ? { translateX: 0 } : { translateX: 300 }}
        transition={{ duration: 0.25 }}
      >
        <h2>{pikachu.name}</h2>
        <img src={pikachu.sprites.front_default} alt="pikachu" />
      </motion.div>
      {/* suspense with non-delayed response */}
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={charmander}>
          {(charmander: any) => (
            <motion.div
              ref={charmanderRef}
              animate={
                charmanderIsInView ? { translateX: 0 } : { translateX: 300 }
              }
              transition={{ duration: 0.25 }}
            >
              <h2>{charmander.name}</h2>
              <img src={charmander.sprites.front_default} alt="charmander" />
            </motion.div>
          )}
        </Await>
      </Suspense>
      {/* suspense with delayed response */}
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
      {/* using react-intersection-observer with a delayed response */}
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

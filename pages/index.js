import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200 font-sans text-xl text-gray-900">
      <Head>
        <title>Find Finn the Dog</title>
        <meta name="description" content="We found him!" />
        <link rel="icon" href="/beans icon.png" />
      </Head>

      <Hero />
    </div>
  );
}

function Hero() {
  return (
    <div className="relative bg-yellow-800 min-h-screen">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="/brandywine.jpg"
          alt=""
        />
        <div
          className="absolute inset-0 bg-yellow-900 mix-blend-multiply"
          aria-hidden="true"
        />
      </div>
      <div className="relative  mx-auto py-24 px-4  sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center w-full">
        <div className="w-2/3">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            We found Finn!
          </h1>
          <p className="mt-6 text-3xl text-gray-300">
            Thank you so much to everyone who helped and supported us along the
            way! Finn was found in Ramsey&apos;s farm on August 6. He is in good
            condition! We caught him on camera all the way up into Chadds Ford,
            PA before he circled back into the park.
          </p>
        </div>
        <img
          src="found finn.jpg"
          width="600"
          className="rounded-3xl border-2 border-black mx-auto mg:mx-0 mt-20"
        />
      </div>
    </div>
  );
}

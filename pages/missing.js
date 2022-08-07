import Head from "next/head";

import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Firebase init
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhQtBwZ8Yx0wPiEpMhcHzwSxQcr4DMfCo",
  authDomain: "findfinnthedog.firebaseapp.com",
  projectId: "findfinnthedog",
  storageBucket: "findfinnthedog.appspot.com",
  messagingSenderId: "148396981501",
  appId: "1:148396981501:web:731bdec94ec43ec460d294",
  measurementId: "G-HLJD7XRT8D",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export default function Missing() {
  const [user, loading, error] = useAuthState(auth);
  const [searchesRefresh, setSearchesRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-200 font-sans text-xl text-gray-900 pb-20">
      <Head>
        <title>Find Finn the Dog</title>
        <meta name="description" content="Lets find him" />
        <link rel="icon" href="/beans icon.png" />
      </Head>

      <Hero />

      <About />

      <Sightings />

      <Searches
        user={user}
        searchesRefresh={searchesRefresh}
        setShowModal={setShowModal}
      />

      {/* <Purpose /> */}

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        searchesRefresh={searchesRefresh}
        setSearchesRefresh={setSearchesRefresh}
        user={user}
      />
    </div>
  );
}

function Hero() {
  return (
    <div className="relative bg-yellow-800">
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
      <div className="relative max-w-[90%] mx-auto py-24 px-4 sm:py-20 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between text-center md:text-left">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Help us find our dog Finn!
          </h1>
          <p className="mt-6 text-3xl text-gray-300 max-w-3xl">
            Finn, our 2-year-old English Pointer,{" "}
            <a
              href="https://goo.gl/maps/9YgU9We4TEnyJcFF7"
              rel="noopener noreferrer"
              target="_blank"
              className="underline text-blue-300"
            >
              went missing in Ramsey&apos;s Farm in Delaware
            </a>{" "}
            on Friday, July 22. We need all the help we can get to bring him
            back safely to us.
          </p>
          <p className="mt-6 text-3xl text-gray-200 md:w-2/3">
            If you think you&apos;ve seen him, please contact us right away:
          </p>

          <p className="mt-6 text-3xl text-gray-100 max-w-3xl font-bold">
            Phone: <span>(302) 220-9433 </span>
          </p>
        </div>
        <img
          src="finnUpright.jpg"
          width="350"
          className="rounded-3xl border-2 border-black mx-auto mg:mx-0 mt-4 md:mt-0"
        />
      </div>
    </div>
  );
}

function Sightings() {
  const [sightings, setSightings] = useState([]);

  useEffect(() => {
    async function loadSightings() {
      const snapshot = await getDocs(collection(firestore, "sightings"));

      let temp = [];

      snapshot.forEach((doc) => {
        temp.push(doc.data());
      });
      setSightings(temp);
    }
    loadSightings();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-20 mt-10">
      <div className=" flex flex-col pt-4 border-t-2 border-gray-400 text-center md:text-left">
        <h1 className="text-4xl font-bold">Sightings</h1>
        <p className="text-gray-600 mt-2 text-2xl">
          Here are the most recent sightings sent in from the community
        </p>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left  font-semibold text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left font-semibold text-gray-900"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left font-semibold text-gray-900"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sightings.map((sighting) => (
                    <tr key={sighting.name}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3  font-medium text-gray-900 sm:pl-6">
                        {sighting.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                        {new Date(
                          sighting.time.seconds * 1000 +
                            sighting.time.nanoseconds / 1000000
                        ).toDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4  text-gray-500">
                        {sighting?.locationIsLink ? (
                          <a
                            href={sighting.locationLink}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="text-blue-400 underline hover:opacity-80"
                          >
                            {sighting.location}
                          </a>
                        ) : (
                          <p>{sighting.location}</p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4  text-gray-500">
                        {sighting.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Searches({ user, searchesRefresh, setShowModal }) {
  const [searches, setSearches] = useState([]);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        // ...
      });
  };

  useEffect(() => {
    async function loadSearches() {
      const q = query(collection(firestore, "searches"), orderBy("time"));
      const snapshot = await getDocs(q);

      let temp = [];

      snapshot.forEach((doc) => {
        temp.push(doc.data());
      });
      setSearches(temp);
    }
    loadSearches();
  }, [searchesRefresh]);

  return (
    <div className="px-4 sm:px-6 lg:px-20 mt-8">
      <div className="flex flex-col pt-4 border-t-2 border-gray-400">
        <div className="flex flex-col md:flex-row justify-between text-4xl font-bold text-center md:text-left">
          <div className="md:w-2/3">
            <h1>Community Searches</h1>
            <p className="text-gray-600 mt-2 text-2xl font-normal">
              The DE and PA community is out searching for Finn! If you want to
              search for Finn, first see where people have been looking. If you
              want to let the community know where you looked,{" "}
              <span className="underline">
                you can sign in with Google to add your own search here!
              </span>
            </p>
          </div>
          {user ? (
            <div className="flex md:flex-col md:items-end gap-2 justify-center items-center">
              <h1>
                Hello, <span className="text-gray-800">{user.displayName}</span>
              </h1>
              <button
                onClick={() => signOut(auth)}
                className="font-normal px-4 py-2 text-2xl bg-yellow-800 rounded-2xl text-gray-200 hover:opacity-70 "
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col">
              <button
                onClick={signInWithGoogle}
                className="bg-yellow-800 text-gray-200 rounded-2xl px-2 py-4 hover:opacity-70"
              >
                Sign In with Google
              </button>
              <p className="font-normal text-lg text-gray-700">
                (This is only for authentication)
              </p>
            </div>
          )}
        </div>
      </div>
      {user && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className=" px-3 py-4 bg-yellow-800 rounded-2xl text-gray-200 text-2xl hover:opacity-70 mt-12 md:mt-4"
          >
            Add a Finn Search
          </button>
        </div>
      )}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left  font-semibold text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left font-semibold text-gray-900"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left font-semibold text-gray-900"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {searches.map((search) => (
                    <tr key={search.name} className="w-full">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 w-1/6 font-medium text-gray-900 sm:pl-6 overscroll-auto">
                        {search.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 w-1/6 text-gray-500 overscroll-auto">
                        {new Date(
                          search.time.seconds * 1000 +
                            search.time.nanoseconds / 1000000
                        ).toDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 w-1/3 text-gray-500 overscroll-auto">
                        {search.location}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 w-1/3 text-gray-500 overscroll-auto">
                        {search.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({
  showModal,
  setShowModal,
  searchesRefresh,
  setSearchesRefresh,
  user,
}) {
  const cancelButtonRef = useRef(null);
  const [location, setLocation] = useState("");
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState("");

  async function addSearch() {
    if (!location || !notes) {
      return;
    }

    await addDoc(collection(firestore, "searches"), {
      name: user.displayName,
      location: location,
      time: Timestamp.fromDate(time),
      notes: notes,
    });
    setSearchesRefresh(!searchesRefresh);
  }

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setShowModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-3xl leading-6 font-medium text-gray-900"
                  >
                    Add a Finn Search
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-lg text-gray-500">
                      We want everyone to know who&apos;s searching where. If
                      you went searching for Finn, please let others know where
                      you searched. Thank you!
                    </p>
                  </div>

                  <p className="block mb-2 text-lg font-medium text-gray-700 text-center mt-4">
                    Enter the date you searched
                  </p>
                  <DatePicker
                    selected={time}
                    onChange={(date) => setTime(date)}
                    className="bg-gray-200 rounded-md text-gray-500 text-xl px-3"
                  />

                  <label
                    htmlFor="location"
                    className="block mb-2 text-lg font-medium text-gray-700 text-left mt-4"
                  >
                    Enter the location you searched
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="enter the location you searched"
                    autoComplete="off"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />

                  <label
                    htmlFor="notes"
                    className="block mb-2 text-lg font-medium text-gray-700 text-left mt-4"
                  >
                    Enter your search notes
                  </label>
                  <textarea
                    type="text"
                    name="notes"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="enter any notes about your search"
                    autoComplete="off"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-800 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    onClick={async () => {
                      await addSearch();
                      setShowModal(false);
                    }}
                  >
                    Add Your Search
                  </button>
                  <button
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowModal(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function Purpose() {
  return (
    <div className="px-4 sm:px-6 lg:px-20 mt-8 flex flex-col sm:flex-row justify-center gap-5 text-center ">
      <div className="pt-4 border-t-2 border-gray-400 w-full">
        <h2 className="text-4xl font-bold">Sightings</h2>
        <p className="text-2xl w-5/6 mx-auto text-gray-700 pt-4">
          A &quot;sighting&quot; is when someone calls us having seen Finn. We
          don&apos;t want people spamming fake sightings, so only we are going
          to add them here. Keep checking back daily, though, to see if
          there&apos;s new sightings!
        </p>
      </div>
      <div className="pt-4 border-t-2 border-gray-400 w-full">
        <h2 className="text-4xl font-bold">Community Searches</h2>
        <p className="text-2xl w-5/6 mx-auto text-gray-700 pt-4">
          &quot;Searches&quot; are the community going out and looking for Finn.
          We think this is relevant so that everyone can see where everyone is
          looking. If you see that people haven&apos;t searched a specific area,
          it might be a good idea to go look there! You can add them right here
          on the website after sigining in with Google!
        </p>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="px-4 sm:px-6 lg:px-20 mt-8 ">
      <div className="flex flex-col pt-4 border-t-2 border-gray-400">
        <div className="flex flex-col md:flex-row justify-between text-3xl font-bold gap-4">
          <div className="md:w-2/3 order-2 text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-4xl">About</h1>
            <p className="text-gray-600 mt-2 text-2xl font-normal">
              We lost our dog Finn on July 22 in Ramsey&apos;s Farm in Delaware.
              We are deeply concerned that we will not find him ourselves since
              there is a very large area of woods where he could be. Our friends
              and family have been asking how they can help, so we put together
              this website to keep everyone on the same page. He is a 2 year
              old, 40-lb English Pointer. He is usually very friendly and
              usually loves people, however we believe that he is now in
              &quot;survival mode.&quot; This means that he might be afraid of
              people or might run away at sudden noises. his harness has
              reflective yarn, which should hopefully shine if using a
              flashlight or car light to search.{" "}
              <span className="underline">
                If you know someone with tracking dogs, we would appreciate if
                you put us in contact!
              </span>
            </p>
          </div>
          <div className="order-1 md:order-3 w-full md:w-1/3 py-3 bg-yellow-900 rounded-3xl border-black border-2 flex justify-center items-center text-gray-200 flex-col gap-3 text-4xl">
            <p className="inline text-center">
              Reward Available for safe return
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 justify-items-center gap-3">
        <img
          src="finnstick.jpg"
          alt="Finn picture with stick"
          width="400"
          className="rounded-xl border-2 border-black"
        />
        <img
          src="finnbed.jpg"
          alt="Finn on a bed"
          width="400"
          className="rounded-xl border-2 border-black"
        />
        <img
          src="prettyFinn.jpeg"
          alt="Finn being pretty"
          width="400"
          className="rounded-xl border-2 border-black"
        />
      </div>
      <h2 className="text-4xl font-bold text-center mt-4">
        Where we think Finn is
      </h2>
      <p className="text-center text-gray-700">
        We think he&apos;s in this area of upper Delaware into lower
        Pennsylvania. He could be as far north as Route 1 in PA.
      </p>
      <img
        src="map.jpg"
        className="mt-8 mx-auto rounded-xl border-2 border-black"
        height="300"
        width="800"
      />
      <p className="mt-6 text-3xl text-gray-800 w-full font-bold text-center">
        If you think you&apos;ve seen him, please call{" "}
        <span>(302) 220-9433 </span>
      </p>
      <p className="mt-6 text-3xl text-gray-800 w-full font-bold text-center underline">
        Do NOT yell! He might run away from the sound of your voice.
      </p>
    </div>
  );
}

import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>UNI CONENCT</title>
        <meta
          name="description"
          content="This application is for simplifying the process of applying to universities for students"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>UNI CONNECT</h1>
      </main>
    </div>
  );
};

export default Home;

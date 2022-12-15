import { Component, createEffect } from 'solid-js';
import logo from './logo.svg';
import styles from './App.module.css';

import model from './model';
console.log(model)

//TODO: find way to display model

// 'await' has no effect
// createEffect(async () => {
//   await model;
//   Promise.all()
// });

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p class="text-4xl text-red-400 tracking-widest">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
    </div>
  );
};

// type 'Sequential' is not assignable to type 'Element'
// const ModelTable: Component = () => {
//   return (
//     <div>
//       {model}
//     </div>
//   );
// };

export default App;

// npm run dev
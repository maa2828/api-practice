// ============================================
// 総合演習 01〜06  exercises.ts
// 実行手順: npm install → npm run build → npm start
// ============================================

// ===== 01: TypeScript環境構築 =====
// 01-EX1: Hello表示
function ex01_1() {
  console.log("Hello, TypeScript!");
}
// 01-EX3: scripts(build/start)を実際に実行 → 達成済み
// 01-EX4: tsconfig.json は、TypeScriptをコンパイルするときの設定(ルール)を決めるファイル
// 01-EX5: npm run build で dist/exercises.js が生成されることを確認した

// ===== 02: データ型と変数 =====
// 02-EX1: 基本の型を全部使う
function ex02_1() {
  const myNumber: number = 42;
  const myString: string = "hello";
  const myBoolean: boolean = true;
  const myNull: null = null;
  const myUndefined: undefined = undefined;
  console.log(myNumber, myString, myBoolean, myNull, myUndefined);
}
// 02-EX2: let と const（const2つ・let1つ、letだけ変更）
function ex02_2() {
  const userName: string = "Taro";
  const userAge: number = 20;
  let count: number = 0;
  count = 5; // let は変更できる
  console.log(userName, userAge, count);
}
// 02-EX3: 合計と平均
function ex02_3() {
  const a: number = 10;
  const b: number = 20;
  const c: number = 30;
  const sum = a + b + c;
  const avg = sum / 3;
  console.log("合計:", sum, "平均:", avg);
}
// 02-EX4: 文字列結合で自己紹介
function ex02_4() {
  const myName: string = "Taro";
  const myAge: number = 20;
  console.log(myName + " is " + myAge + " years old");
}
// 02-EX5: 型エラーを再現→修正
function ex02_5() {
  // const wrong: number = "hello"; // ← string を number の箱に入れようとして型エラー
  // 理由: number型の変数に文字列は代入できないため
  const correct: number = 100; // 正しいコード
  console.log(correct);
}

// ===== 03: 条件分岐と比較演算子 =====
// 03-EX1: 20歳以上判定
function ex03_1() {
  const age: number = 25;
  if (age >= 20) {
    console.log("adult");
  } else {
    console.log("minor");
  }
}
// 03-EX2: 点数ランク
function ex03_2() {
  const score: number = 85;
  if (score >= 90) {
    console.log("A");
  } else if (score >= 80) {
    console.log("B");
  } else if (score >= 70) {
    console.log("C");
  } else {
    console.log("D");
  }
}
// 03-EX3: AND条件
function ex03_3() {
  const age: number = 22;
  const hasTicket: boolean = true;
  if (age >= 20 && hasTicket === true) {
    console.log("enter");
  }
}
// 03-EX4: OR条件
function ex03_4() {
  const isMember: boolean = false;
  const hasCoupon: boolean = true;
  if (isMember || hasCoupon) {
    console.log("discount");
  } else {
    console.log("no discount");
  }
}
// 03-EX5: NOT
function ex03_5() {
  const isLoggedIn: boolean = false;
  if (!isLoggedIn) {
    console.log("please login");
  }
}

// ===== 04: 算術 / if-else / switch / 論理演算子 =====
// 04-EX1: 偶数/奇数
function ex04_1() {
  const n: number = 7;
  if (n % 2 === 0) {
    console.log("even");
  } else {
    console.log("odd");
  }
}
// 04-EX2: 割り勘
function ex04_2() {
  const totalPrice: number = 10000;
  const people: number = 4;
  const each = totalPrice / people;
  console.log("each:", each);
}
// 04-EX3: switchで曜日分類
function ex04_3() {
  const day: number = 6;
  switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      console.log("weekday");
      break;
    case 6:
    case 7:
      console.log("weekend");
      break;
    default:
      console.log("invalid");
  }
}
// 04-EX4: mini電卓
function ex04_4() {
  const left: number = 6;
  const right: number = 3;
  const op: string = "+";
  switch (op) {
    case "+": console.log(left + right); break;
    case "-": console.log(left - right); break;
    case "*": console.log(left * right); break;
    case "/": console.log(left / right); break;
    default: console.log("invalid operator");
  }
}
// 04-EX5: 複合条件（括弧で結果が変わる例）
function ex04_5() {
  const a: boolean = false;
  const b: boolean = true;
  const c: boolean = true;
  console.log((a && b) || c); // → true
  console.log(a && (b || c)); // → false
}

// ===== 05: ループ =====
// 05-EX1: 1〜20を表示
function ex05_1() {
  for (let i = 1; i <= 20; i++) {
    console.log(i);
  }
}
// 05-EX2: 1〜100の合計
function ex05_2() {
  let sum = 0;
  for (let i = 1; i <= 100; i++) {
    sum += i;
  }
  console.log(sum); // 5050
}
// 05-EX3: 5の倍数だけ表示
function ex05_3() {
  for (let i = 1; i <= 50; i++) {
    if (i % 5 !== 0) {
      continue;
    }
    console.log(i);
  }
}
// 05-EX4: 配列の最初の偶数
function ex05_4() {
  const nums: number[] = [1, 3, 7, 8, 10, 12];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
      console.log(nums[i]);
      break;
    }
  }
}
// 05-EX5: do-whileで最低1回（3回表示）
function ex05_5() {
  let attempts = 0;
  do {
    console.log("attempt", attempts);
    attempts++;
  } while (attempts < 3);
}

// ===== 06: 配列・タプル・操作 =====
// 06-EX1: pushで要素追加
function ex06_1() {
  const nums: number[] = [];
  nums.push(1);
  nums.push(2);
  nums.push(3);
  console.log(nums); // [1, 2, 3]
}
// 06-EX2: mapで2倍
function ex06_2() {
  const nums: number[] = [1, 2, 3, 4];
  const doubled = nums.map((n) => n * 2);
  console.log(doubled); // [2, 4, 6, 8]
}
// 06-EX3: filterで偶数
function ex06_3() {
  const nums: number[] = [1, 2, 3, 4, 5, 6];
  const evens = nums.filter((n) => n % 2 === 0);
  console.log(evens); // [2, 4, 6]
}
// 06-EX4: findで最初の>10
function ex06_4() {
  const nums: number[] = [5, 12, 8, 130, 44];
  const found = nums.find((n) => n > 10);
  console.log(found); // 12
}
// 06-EX5: タプルでユーザー情報
function ex06_5() {
  const user: [string, number] = ["Taro", 20];
  console.log("名前:", user[0], "年齢:", user[1]);
}

// ===== 全部実行 =====
ex01_1();
ex02_1();
ex02_2();
ex02_3();
ex02_4();
ex02_5();
ex03_1();
ex03_2();
ex03_3();
ex03_4();
ex03_5();
ex04_1();
ex04_2();
ex04_3();
ex04_4();
ex04_5();
ex05_1();
ex05_2();
ex05_3();
ex05_4();
ex05_5();
ex06_1();
ex06_2();
ex06_3();
ex06_4();
ex06_5();
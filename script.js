'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${movement}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, curr) {
    return acc + curr;
  });
  labelBalance.textContent = acc.balance + '€';
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const intrests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(intrest => intrest >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${intrests}€`;
};

createUserName(accounts);

let currentAccount, timer;

const updateDisplay = function () {
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }`;
  containerApp.style.opacity = 100;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  displayMovements(currentAccount);
  calcBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    updateDisplay();
  }
  setTimer(10);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  setTimer(10);
  const toUser = accounts.find(acc => acc.username === inputTransferTo.value);
  const ammountToTransfare = Math.abs(Number(inputTransferAmount.value));
  if (!toUser) {
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    alert('No User has this name');
    return;
  }
  if (toUser.username === currentAccount.username) {
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();

    alert('You cant transfare to your own account');
    return;
  }
  if (ammountToTransfare > currentAccount.balance) {
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    alert('You dont have enough money');
    return;
  }
  currentAccount.movements.push(ammountToTransfare * -1);
  toUser.movements.push(ammountToTransfare);
  updateDisplay();
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  alert('Transfare done successfully');
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  const accountIndex = accounts.findIndex(
    acc => acc.username === user && acc.pin === pin
  );
  if (accountIndex === -1) {
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    alert('Incorrect account');
    return;
  }
  if (accounts[accountIndex].username !== currentAccount.username) {
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    alert('You cant delete someone else account');
    return;
  }
  accounts.splice(accountIndex, 1);
  containerApp.style.opacity = 100;
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  alert('the Account has been closed');
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  setTimer(10);
  const loneAmmount = Math.abs(Number(inputLoanAmount.value));
  const alloewdToLone = currentAccount.movements.some(
    movement => movement > loneAmmount / 10
  );
  if (!alloewdToLone) {
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    alert('Not allowed to lone this ammpunt yet');
    return;
  }
  currentAccount.movements.push(loneAmmount);
  updateDisplay();
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  alert('Lone done successfully');
});

btnSort.addEventListener('click', function (e) {
  currentAccount.movements.sort((a, b) => a - b);
  updateDisplay();
});

const setTimer = function (min) {
  if (timer) {
    console.log('timer');
    clearInterval(timer);
  }
  let time = min * 60;
  // prettier-ignore
  timer = setInterval(function () {
    if (time >= 0) {
      let timeText = `${String(Math.trunc(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
      labelTimer.textContent = timeText;
      time--;
    } else {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }
  }, 1000);
};

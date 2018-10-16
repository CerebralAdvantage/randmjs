/*
  randm.js
  A javascript PRNG copied from George Marsaglia's CMWC4096
  (Complimentary Multiply with Carry) PRNG (ACM, May 2003)
  static unsigned long Q[4096],c=362436;
  unsigned long CMWC4096(void){
  unsigned long long t, a=18782LL;
  static unsigned long i=4095;
  unsigned long x,r=0xfffffffe;
     i=(i+1)&4095;
     t=a*Q[i]+c;
     c=(t>>32); x=t+c; if(x<c){x++;c++;}
     return(Q[i]=r-x);
  }
*/

  let uint32rnds = new Uint32Array(4100); // Q, c, x, r, i
  uint32rnds[4096] = 362436;     // c
  uint32rnds[4098] = 0xfffffffe; // r
  uint32rnds[4099] = 4095;       // i
  let seededRandm = false;

  function randmGen()
  {
    const c = 4096, x = 4097, r = 4098;
    let t, a=18782;
    let i = uint32rnds[4099];
    i = (i+1) & 4095;                        // i=(i+1)&4095;
    t = a * uint32rnds[i] + uint32rnds[c];   // t=a*Q[i]+c;
    uint32rnds[c] = (t|(t>>32))& 0xffffffff; // c=(t>>32);
    uint32rnds[x] = t + uint32rnds[c];       // x=t+c;
    if (uint32rnds[x]< uint32rnds[c]) {      // if(x<c){x++;c++;}
      uint32rnds[x]++;
      uint32rnds[c]++;
    }
    uint32rnds[i] = uint32rnds[r] - uint32rnds[x]; // return(Q[i]=r-x);
    uint32rnds[4099] = i;
    return uint32rnds[i];
  }

  function Burn(millis) // churns for time amount (very random)
  {
    const c = 4096, x = 4097, r = 4098;
    let t, a=18782;
    let i = uint32rnds[4099];
    let Tn, goal, tot;
    tot = 0;
    goal = Date.now() + millis;
    while(Date.now() < goal)
    {
      i = (i+1) & 4095;                        // i=(i+1)&4095;
      t = a * uint32rnds[i] + uint32rnds[c];   // t=a*Q[i]+c;
      uint32rnds[c] = (t|(t>>32))& 0xffffffff; // c=(t>>32); 
      uint32rnds[x] = t + uint32rnds[c];       // x=t+c; 
      if (uint32rnds[x]< uint32rnds[c]) {      // if(x<c){x++;c++;}
        uint32rnds[x]++;
        uint32rnds[c]++;
      }
      uint32rnds[i] = uint32rnds[r] - uint32rnds[x]; // return(Q[i]=r-x);
      tot++;
    } // while
    uint32rnds[4099] = i;
    //console.log(tot);
  } // Burn()

  function Churn(reps) // churns a precise amount (for hashing, etc)
  {
    const c = 4096, x = 4097, r = 4098;
    let t, a=18782;
    let i = uint32rnds[4099];
    let Tn, tot;
    tot = 0;
    while(tot < reps)
    {
      i = (i+1) & 4095;                        // i=(i+1)&4095;
      t = a * uint32rnds[i] + uint32rnds[c];   // t=a*Q[i]+c;
      uint32rnds[c] = (t|(t>>32))& 0xffffffff; // c=(t>>32);
      uint32rnds[x] = t + uint32rnds[c];       // x=t+c;
      if (uint32rnds[x]< uint32rnds[c]) {      // if(x<c){x++;c++;}
        uint32rnds[x]++;
        uint32rnds[c]++;
      }
      uint32rnds[i] = uint32rnds[r] - uint32rnds[x]; // return(Q[i]=r-x);
      tot++;
    } // while
    uint32rnds[4099] = i;
    //console.log(tot);
  } // Churn()

  /*
   *  This sets up the random "pool" with a very diverse population
   *  of extremely hard-to-guess 32-bit unsigned integers. It takes
   *  no parameters because it relies on a functioning millisecond
   *  clock, and a human operator to run the program, without preseeding,
   *  at a random 1000/th of a second.  (that's easy for most humans)
   */
  function ReallyRandomSeeding()
  {
    let r = Date.now() % 500 + 1;  // This is a REALLY RANDOM value 1..500
    for(let z=0;z<4096;z++) uint32rnds[z] = Date.now(); // fill array with ANY non-zero value
    Burn(200);                 // this is about 0.2s
    uint32rnds[4099] = 4095;   // reset the "i" pointer
    Burn(r);                   // 0.001s - 0.5s
    uint32rnds[4099] = 4095;   // reset the "i" pointer (again)
    seededRandm = true;
    // for(let z=0;z<4096;z++) console.log(uint32rnds[z]);
  }

  function randm()
  {
    if (!seededRandm) // not seeded.  assumption: user wants a really random number
    {
      ReallyRandomSeeding();
    }
    return randmGen();
  }
  console.log(randm());
  console.log(randm());
  console.log(Date.now());
  let yy, zz, xx=0;
  console.log("HEY!!!");
  // 60,000,000 less than 1s on my box
  yy = Date.now();
  for(let z=0;z < 60000000; z++) xx = randm();
  zz = Date.now();
  console.log(zz-yy);


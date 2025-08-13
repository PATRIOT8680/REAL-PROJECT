const pedPos = new mp.Vector3(1948.4307861328125, 3916.800048828125, 38.833740234375)

for (let i = 0; i < 3; i++) {
  mp.peds.new(mp.joaat('mp_f_stripperlite'), pedPos, {
    dynamic: false,
    frozen: false,
    invincible: false,
  })
}
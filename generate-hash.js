import bcrypt from "bcryptjs";
const hash = await bcrypt.hash("rahulmmt@123", 10);
console.log(hash);
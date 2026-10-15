let stdname = document.getElementById('stdName')
let stdemail = document.getElementById('stdemail')
let stdphone = document.getElementById('stdphone')
let stdage = document.getElementById('stdage')
let stdcourse = document.getElementById('stdcourse')
let join = document.getElementById('btnrig')

let student = []
join.addEventListener("click",function(){
  let std1={
    name: stdName.value,
    email: stdemail.value,
    age: stdage.value,
    phone: stdphone.value,
    course: stdcourse.value,
  }
  student.push(std1)
  stdname.value=""
   stdemail.value=""
    stdage.value=""
     stdcourse.value=""
     stdphone.value=""

})
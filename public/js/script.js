function dlt(_id) {
  fetch("/delete-user/" + _id, {
    method: "delete",
  }).then(() => {
    window.location.reload();
  });
}
  function searchUser(){
    const query=document.getElementById('search').value
    window.location.href=`/dashboard?search=${query}`
  }

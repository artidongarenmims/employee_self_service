function autoLogout(){
    let logoutTimeout;
    let timeForLogout = 300 //300 seconds
    let activeSeconds = timeForLogout;

    function logoutUser() {
      location.reload();
      console.log('LOGOUT')
      location.href = '/logout'
    }
    // Function to update the active time
    function updateActiveTime() {
      activeSeconds--;
      if(activeSeconds <= 30) {
        $('#activeTime').css({
        'color': 'red'
      });
      } else {
        $('#activeTime').css({
        'color': 'black'
      });
      }
      const hours = Math.floor(activeSeconds / 3600);
      const minutes = Math.floor((activeSeconds % 3600) / 60);
      const seconds = activeSeconds % 60;
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
       document.getElementById('activeTime').innerText = formattedTime;
    }
    function resetTimer() {
      activeSeconds = timeForLogout;
      const hours = Math.floor(activeSeconds / 3600);
      const minutes = Math.floor((activeSeconds % 3600) / 60);
      const seconds = activeSeconds % 60;
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
       document.getElementById('activeTime').innerText = formattedTime;
    }
    function startLogoutTimer() {
      clearTimeout(logoutTimeout);
      //logout users only in production environment.
      // logoutTimeout = setTimeout(logoutUser, 300000);
      logoutTimeout = setTimeout(logoutUser, timeForLogout*1000); // 5 minutes = 5 * 60 * 1000 milliseconds ===300000
    }
    document.addEventListener("mousemove", function() {
      startLogoutTimer();
      resetTimer()
    });
    document.addEventListener("keydown", function() {
      startLogoutTimer();
      resetTimer()
    });
    document.addEventListener("onmouseleave", function() {
      startLogoutTimer();
      resetTimer()
    });
    document.addEventListener("click", function() {
      startLogoutTimer();
      resetTimer()
    });
    startLogoutTimer();
    updateActiveTime();
    setInterval(updateActiveTime, 1000);
}
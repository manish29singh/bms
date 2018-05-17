module.exports.isSuper =  function (role) {
    if (role == 0) return true;
    else return false;
  }

module.exports.isAdmin =  function (role) {
    if (role === 'ADMIN') return true;
    else return false;
  }

module.exports.isTenant =  function (role) {
    if (role === 'TENANT') return true;
    else return false;
  }


module.exports.serial = function(i){
    return ++i;
  }

module.exports.changeColor = function(active){
    if(active){
      return 'checked';
    }else{
      return '';
    }
  }

module.exports.disableReInvite = function(active){
    if(active) return 'disabled';
    else return '';
  }


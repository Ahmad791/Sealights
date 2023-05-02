export var Logger = { //chose a singleton because we only need one and no data
    log: function (x:any) {
      console.log("Logger: "+x)
    },
    info: function (x:any) {
        console.info("Logger info: "+x);
    },
    warn: function (x:any) {
        console.warn("Logger Warning: "+x);
    }
  };
  
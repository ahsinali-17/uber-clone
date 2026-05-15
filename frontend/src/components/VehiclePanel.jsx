import React from "react";

const VehiclePanel = ({ setOpenvehiclePanel, setConfirmRidePanel, setVehicle, fare}) => {
  return (
    <div>
      {" "}
      <div className="flex items-center justify-between w-full mb-2 p-3 ">
        <h2 className="text-2xl font-bold">Choose a Vehicle</h2>
        <img
          src="/src/assets/down.svg"
          alt=""
          onClick={() => {
            setOpenvehiclePanel(false);
          }}
          className="cursor-pointer"
        />
      </div>
      <div onClick={()=>{setVehicle("car"); setConfirmRidePanel(true);}} className="flex items-center justify-between w-full mb-2 p-3 border-2 border-gray-100 active:border-black rounded-xl">
        <img
          className="h-10"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt=""
        />
        <div className="flex flex-col justify-center w-1/2">
          <h4 className="flex items-center font-semibold">
            <span className="text-lg mr-3">UberGo</span>
            <img src="/src/assets/man.svg" alt="" />
            <span>4</span>{" "}
          </h4>
          <p className="text-sm">{fare.time} min away</p>
          <p className="text-gray-600 text-sm">affordable, compact rides</p>
        </div>
        <h2 className="font-bold text-lg text-center">Rs. {fare.car}</h2>
      </div>

      <div onClick={()=>{setVehicle("bike"); setConfirmRidePanel(true);}} className="flex items-center justify-between w-full mb-2 p-2 border-2 border-gray-100 active:border-black rounded-xl">
        <img
          className="h-10"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=1344/height=896/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9lZjA5NThiZC1kNDMwLTQ1ZWYtYmU2Yi0zYmZiY2JmMDYyZjYucG5n"
          alt=""
        />
        <div className="flex flex-col justify-center w-1/2">
          <h4 className="flex items-center font-semibold">
            <span className="text-lg mr-3">Moto</span>
            <img src="/src/assets/man.svg" alt="" />
            <span>1</span>{" "}
          </h4>
          <p className="text-sm">{fare.time} min away</p>
          <p className="text-gray-600 text-sm text-nowrap">
            affordable, motorcycle rides
          </p>
        </div>
        <h2 className="font-bold text-lg text-center">Rs. {fare.bike}</h2>
      </div>

      <div onClick={()=>{setVehicle("auto"); setConfirmRidePanel(true);}} className="flex items-center justify-between w-full mb-2 p-3 border-2 border-gray-100 active:border-black rounded-xl">
        <img
          className="h-10"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYol20lgh5HsIjDv19gT2lh9JUZfoolHS74w&s"
          alt=""
        />
        <div className="flex flex-col justify-center w-1/2">
          <h4 className="flex items-center font-semibold">
            <span className="text-lg mr-3">UberAuto</span>
            <img src="/src/assets/man.svg" alt="" />
            <span>3</span>{" "}
          </h4>
          <p className="text-sm">{fare.time} min away</p>
          <p className="text-gray-600 text-sm">affordable, auto rides</p>
        </div>
        <h2 className="font-bold text-lg text-center">Rs. {fare.auto}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;

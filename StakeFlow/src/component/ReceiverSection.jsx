// eslint-disable-next-line
const ReceiverSection = ({ currency }) => {
  return (
    <div>
      <div className="flex justify-between">
        <label htmlFor="staker">Receiver</label>
        {/* <img src="" alt="" /> */}
        {/* <div>Image</div> */}
      </div>
      {/* receiver input */}
      <div>
        <div className="flex gap-4 ">
          <div>
            <input
              type="number"
              id="receiverInput"
              name="ReceiverAmount"
              className="pt-2 rounded"
            />
            <p>0</p>
          </div>
          <div className="">
            <p>{currency}</p>
            <p>balance:0000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverSection;

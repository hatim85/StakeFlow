const StakeSection = () => {
  return (
    <div>
      {" "}
      <div className="flex justify-between">
        <label htmlFor="staker">Staker</label>
        {/* <img src="" alt="" /> */}
        {/* <div>XFI</div> */}
      </div>
      {/* stake input */}
      <div>
        <div className="flex gap-4 ">
          <div>
            <input
              type="number"
              id="stakeInput"
              name="stakeAmount"
              className="pt-2 rounded"
            />
            <p>0</p>
          </div>
          <div>
            <p>XFI</p>
            <p>balance:00000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeSection;

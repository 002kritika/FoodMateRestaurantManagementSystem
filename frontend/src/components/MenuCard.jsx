export default function MenuCard() {
  return (
    <div className="card bg-white w-96 shadow-xl">
      <figure className="px-10 pt-10">
        <img
          src="https://junifoods.com/wp-content/uploads/2023/11/Easy-Chicken-Momo-Dumplings-Sajilo-Kukhura-ko-Momo-%E0%A4%B8%E0%A4%9C%E0%A4%BF%E0%A4%B2%E0%A5%8B-%E0%A4%95%E0%A5%81%E0%A4%96%E0%A5%81%E0%A4%B0%E0%A4%BE%E0%A4%95%E0%A5%8B-%E0%A4%AE%E0%A4%AE.jpg"
          alt="Shoes"
          className="rounded-xl "
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">Momo</h2>
        <p>If a dog chews momo whose momo does he choose?</p>
        <div className="card-actions">
          <button className="btn btn-primary bg-[#bc0030] text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

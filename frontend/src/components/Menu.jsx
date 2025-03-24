import MenuCard from "./MenuCard";

export default function Menu() {
  return (
    <div className="bg-white">
      <h1 className="text-center text-3xl font-semibold p-3 text-[#bc0030] animate-pulse">
        Our Menu
      </h1>
      <div className="flex gap-3 mt-3">
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
      </div>
      <div className="flex gap-3 mt-3">
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
      </div>
      <div className="flex gap-3 mt-3">
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
      </div>
    </div>
  );
}

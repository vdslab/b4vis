import { ResponsiveSunburst } from "@nivo/sunburst";

const MyResponsiveSunburst = ({ data /* see data tab */ }) => (
  <div style={{ width: "100%", height: "290px" }}>
    <ResponsiveSunburst
      data={data}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      id="key"
      value="loc"
      cornerRadius={2}
      borderColor={"white"}
      colors={function (e) {
        return e.data.color;
      }}
      childColor={{
        from: "color",
        modifiers: [["brighter", 0.2]],
      }}
      enableArcLabels={true}
      arcLabel={function (e) {
        return e.data.name + " (" + (e.value * 100).toFixed(1) + "%)";
      }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={"black"}
    />
  </div>
);

export default MyResponsiveSunburst;

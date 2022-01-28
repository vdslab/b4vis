import { ResponsiveSunburst } from "@nivo/sunburst";

const MyResponsiveSunburst = ({ data, h , myMargin}) => {
  const height = h ? h : "225px";
  const margin = myMargin?myMargin:{ top: 10, right: 30, bottom: 10, left: 30 }
  return (
    <div style={{ width: "100%", height: height }}>
      <ResponsiveSunburst
        data={data}
        margin={margin}
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
          if (e.data.name === "公立" || e.data.name === "私立") {
            return e.data.name + " (" + e.value + ")";
          }
          return e.data.name;
        }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={"black"}
      />
    </div>
  );
};

export default MyResponsiveSunburst;

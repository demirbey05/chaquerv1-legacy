import { Grid } from "../../components/TerrainComp/Grid";
import { useTerrain } from "../../context/TerrainContext";
import map from "../../../map.json";
import ScrollContainer from "react-indiana-drag-scroll";
import ArmyStageComp from "../../components/GameComp/ArmyStageComp";
import CastleWarning from "../../components/GameComp/CastleWarning";
import ArmyWarning from "../../components/GameComp/ArmyWarning";
import ArmyMoveWarning from "../../components/GameComp/ArmyMoveWarning";
import LoserWarning from "../../components/GameComp/LoserWarning";
import { useUserArmy } from "../../hooks/useUserArmy";
import { getBurnerWallet } from "../../mud/getBurnerWallet";

function Game() {
  const { width, height, isCastleSettled, isArmyStage, isArmyMoveStage, isCastleDeployedBefore } = useTerrain();
  const values = map;
  const myArmyPosition: any = useUserArmy(
    getBurnerWallet().address.toLocaleLowerCase()
  )[0];

  const terrainStyles = [0, 40];

  return (
    <div>
      {!isCastleSettled && <CastleWarning />}
      {isCastleSettled && isArmyStage && <ArmyWarning />}
      {isArmyMoveStage && <ArmyMoveWarning />}
      {isCastleSettled && <ArmyStageComp />}
      <ScrollContainer
        className="scroll-container"
        style={{ zIndex: "0", height: "100vh", overflow: "scroll" }}
      >
        <Grid
          width={width}
          height={height}
          values={values}
          pixelStyles={terrainStyles}
          isBorder={false}
        />
      </ScrollContainer>
    </div>
  );
}

export default Game;

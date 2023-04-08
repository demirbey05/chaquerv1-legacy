import { TerrainType } from "../../terrain-helper/types";
import grassImg from "../../images/grass.png";
import mountainImg from "../../images/mountain.png";
import seaImg from "../../images/sea.png";
import { useTerrain } from "../../context/TerrainContext";
import "../../styles/globals.css";
import CastleSettleModal from "../BootstrapComp/CastleSettleModal";
import { useCastlePositions } from "../../hooks/useCastlePositions";
import { useEffect } from "react";
import { getBurnerWallet } from "../../mud/getBurnerWallet";
import { useBurnerWallets } from "../../hooks/useBurnerWallets";
import { useCastlePositionByAddress } from "../../hooks/useCastlePositionByAddress";

export type DataProp = {
  width: number;
  height: number;
  values: Array<Array<TerrainType>>;
  pixelStyles: Array<any>;
  isBorder: boolean;
};

function bgImg(data: any) {
  if (data === 1) {
    return `url(${grassImg})`;
  } else if (data === 2) {
    return `url(${seaImg})`;
  } else {
    return `url(${mountainImg})`;
  }
}

function getDataAtrX(event: any) {
  const id = event.target.dataset.row;
  return id.toString();
}

function getDataAtrY(event: any) {
  const id = event.target.dataset.column;
  return id.toString();
}

function canCastleBeSettle(data: any) {
  if (data !== 1) {
    return false;
  }
  return true;
}

export function Grid(data: DataProp) {
  const width = data.width;
  const height = data.height;
  const values = data.values;
  const rows = Array.from({ length: height }, (v, i) => i);
  const columns = Array.from({ length: width }, (v, i) => i);

  const { isCastleSettled, setTempCastle, setIsCastleSettled } = useTerrain();
  const castlePositions = useCastlePositions();
  const burnerWallets = useBurnerWallets();
  const myCastlePosition = useCastlePositionByAddress(getBurnerWallet().address.toLocaleLowerCase());

  const handleClick = (e: any) => {
    if (!isCastleSettled) {
      setTempCastle({ x: getDataAtrX(e), y: getDataAtrY(e) });
    }
  };

  useEffect(() => {
    if (castlePositions) 
    {
      burnerWallets.map((wallet) => {
        if(wallet.value.toLocaleLowerCase() === getBurnerWallet().address.toLocaleLowerCase())
        {
          if(myCastlePosition)
          {
            document.getElementById(`${myCastlePosition.y}${myCastlePosition.x}`)!.className = "border-1"
          }
          setIsCastleSettled(true);
        }
      });
      
      castlePositions.map(
        (data) =>
          (document.getElementById(`${data.y}${data.x}`)!.innerHTML = "🏰")
      );
    }
  }, [castlePositions]);

  return (
    <div className={`inline-grid ${data.isBorder && "border-4 border-black"}`}>
      {rows.map((row) => {
        return columns.map((column) => {
          return (
            <div
              key={`${column},${row}`}
              id={`${column}${row}`}
              data-row={`${row}`}
              data-column={`${column}`}
              style={{
                gridColumn: column + 1,
                gridRow: row + 1,
                width: `${data.pixelStyles[1]}px`,
                height: `${data.pixelStyles[1]}px`,
                backgroundImage: `${bgImg(values[row][column])}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize:`${data.isBorder && "3.5px"}`
              }}
              onClick={(e) => {
                handleClick(e);
              }}
              className={`${
                !data.isBorder &&
                canCastleBeSettle(values[row][column]) &&
                "borderHover"
              }`}
              data-bs-toggle={`${
                canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder &&
                "modal"
              }`}
              data-bs-target={`${
                canCastleBeSettle(values[row][column]) &&
                !isCastleSettled &&
                !data.isBorder &&
                "#exampleModal"
              }`}
            ></div>
          );
        });
      })}
      <CastleSettleModal></CastleSettleModal>
    </div>
  );
}

import type { SceneId } from "../timeline";
import { S01A_Scatter } from "./S01A_Scatter";
import { S01B_OnePlace } from "./S01B_OnePlace";
import { S02A_Logo } from "./S02A_Logo";
import { S02B_Social } from "./S02B_Social";
import { S03_BulkUpload } from "./S03_BulkUpload";
import { S04_CommandCenter } from "./S04_CommandCenter";
import { S05_Worth } from "./S05_Worth";
import { S06_MarketData } from "./S06_MarketData";
import { S07A_ShipPause } from "./S07A_ShipPause";
import { S07B_SlabVision } from "./S07B_SlabVision";
import { S08A_Scan } from "./S08A_Scan";
import { S08B_PreGrade } from "./S08B_PreGrade";
import { S09_SubGrades } from "./S09_SubGrades";
import { S10_FoundCard } from "./S10_FoundCard";
import { S11A_TradeRoom } from "./S11A_TradeRoom";
import { S11B_Escrow } from "./S11B_Escrow";
import { S12A_BuySell } from "./S12A_BuySell";
import { S12B_TwoWayTalk } from "./S12B_TwoWayTalk";
import { S12C_Marketplace } from "./S12C_Marketplace";
import { S13_Journey } from "./S13_Journey";
import { S14_Spreadsheet } from "./S14_Spreadsheet";
import { S15_EndCard } from "./S15_EndCard";

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  S01A_Scatter,
  S01B_OnePlace,
  S02A_Logo,
  S02B_Social,
  S03_BulkUpload,
  S04_CommandCenter,
  S05_Worth,
  S06_MarketData,
  S07A_ShipPause,
  S07B_SlabVision,
  S08A_Scan,
  S08B_PreGrade,
  S09_SubGrades,
  S10_FoundCard,
  S11A_TradeRoom,
  S11B_Escrow,
  S12A_BuySell,
  S12B_TwoWayTalk,
  S12C_Marketplace,
  S13_Journey,
  S14_Spreadsheet,
  S15_EndCard,
};

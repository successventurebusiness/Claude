import { ArrowLeftRight, Camera, Lock, Tag } from "lucide-react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { avatar, crowd } from "./assets";
import { Collectible } from "./components/Collectible";
import { Avatar, Counter, Gate, Gauge, LineChart, ListingTile, PriceTag, Stepper, SubgradeTile, ValueBadge } from "./components/Data";
import { LaptopMockup, PhoneMockup } from "./components/Devices";
import { Burst, LightSweep, Magnifier, ParticleField, RingPing, ScanBrackets, ScanLine } from "./components/FX";
import { KineticText } from "./components/KineticText";
import { Logo } from "./components/Logo";
import { TradingCard } from "./components/TradingCard";
import { Button, Chip, Cursor, GlassPanel, TapRipple, Toast } from "./components/UI";
import { UI } from "./fonts";
import { GlobalBackground, GlobalOverlay } from "./Shell";
import { C } from "./theme";

const Pos: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x, top: y }}>{children}</div>
);

/** Every component on one screen (spec section 8, step 1). */
export const Kit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardFace = <TradingCard art="hero" width={150} rotateY={-14} rotateX={4} glow={0.8} />;
  return (
    <AbsoluteFill>
      <GlobalBackground offset={1300} />
      <Pos x={70} y={50}><Logo frame={frame} fps={fps} width={360} built /></Pos>
      <Pos x={480} y={55}><Chip label="Bulk upload" variant="lime" icon={Camera} /></Pos>
      <Pos x={720} y={55}><Chip label="Protected" icon={Lock} /></Pos>
      <Pos x={940} y={50}><Button label="Sign up free" /></Pos>
      <Pos x={1210} y={50}><Button label="Ship for grading" variant="outline" hover={1} /></Pos>
      <Pos x={1560} y={50}><Toast label="Ownership swapped" /></Pos>

      <Pos x={70} y={160}>{cardFace}</Pos>
      <Pos x={260} y={160}><TradingCard art="trade" width={150} rotateY={10} /></Pos>
      <Pos x={450} y={150}><TradingCard art="extra-3" width={140} variant="slab" /></Pos>
      <Pos x={640} y={170}><Collectible kind="coin" size={110} /></Pos>
      <Pos x={770} y={170}><Collectible kind="baseball" size={110} /></Pos>
      <Pos x={900} y={160}><Collectible kind="comic" size={100} /></Pos>
      <Pos x={1030} y={170}><Collectible kind="sheet" size={140} /></Pos>
      <Pos x={1190} y={170}><Collectible kind="sticky" size={100} /></Pos>
      <Pos x={1310} y={170}><Collectible kind="photo" size={130} art="extra-2" /></Pos>
      <Pos x={1460} y={160}><Collectible kind="cartridge" size={100} /></Pos>
      <Pos x={1590} y={160}><Collectible kind="jersey" size={110} /></Pos>
      <Pos x={1730} y={170}><Avatar who={avatar("you")} size={70} ring /></Pos>
      <Pos x={1820} y={170}><Avatar who={crowd(0)} size={70} /></Pos>

      <Pos x={70} y={430}>
        <GlassPanel width={420} height={260} title="Collection value" headerRight={<Chip label="+8.2%" variant="lime" size={18} />}>
          <div style={{ padding: 22 }}>
            <Counter value={12480} format="usd" style={{ fontFamily: UI, fontWeight: 700, fontSize: 40, color: C.white }} />
            <div style={{ marginTop: 10 }}>
              <LineChart width={370} height={90} progress={1} pingFrame={6} points={[[0, 80], [70, 70], [140, 74], [210, 50], [280, 40], [370, 12]]} />
            </div>
          </div>
        </GlassPanel>
      </Pos>
      <Pos x={530} y={430}><Gauge progress={0.9} size={200}><div style={{ fontFamily: UI, fontWeight: 700, fontSize: 56, color: C.white }}>9.0</div></Gauge></Pos>
      <Pos x={770} y={440}><ValueBadge label="Estimated value" value="$225" sub="Based on 14 recent sales" /></Pos>
      <Pos x={1130} y={440}><SubgradeTile label="Corners" value="8.5" strong /></Pos>
      <Pos x={1390} y={440}><SubgradeTile label="Centering" value="9.5" /></Pos>
      <Pos x={1660} y={430}><PriceTag values={["$12", "$85"]} reel={0.3} final="$ ?" landed={1} scale={0.9} stringLength={120} /></Pos>
      <Pos x={1150} y={600}><ListingTile art="extra-5" width={140} height={190} price="$180" /></Pos>
      <Pos x={1320} y={590}><Gate icon={Tag} label="Price" lit={1} flare={0} size={140} /></Pos>
      <Pos x={1520} y={590}><Gate icon={ArrowLeftRight} label="Trade" lit={0} flare={0} size={140} /></Pos>

      <Pos x={70} y={740}><Stepper labels={["Propose", "Accept", "Deposit", "Verify", "Complete"]} fills={[1, 1, 1, 0.4, 0]} width={640} /></Pos>
      <Pos x={70} y={880}>
        <KineticText frame={30} text="Collect smarter with iCollecta." lime={["smarter"]} size={52} align="left" />
      </Pos>
      <Pos x={820} y={720}>
        <div style={{ position: "relative", width: 180, height: 260 }}>
          <TradingCard art="extra-1" width={160} loader={false} />
          <ScanLine width={160} height={224} progress={0.6} />
          <ScanBrackets width={160} height={224} fly={[1, 1, 1, 1]} arm={30} />
        </div>
      </Pos>
      <Pos x={1030} y={720}>
        <div style={{ position: "relative", width: 200, height: 280 }}>
          <TradingCard art="extra-4" width={180} loader={false} />
          <Magnifier x={120} y={80} radius={60} zoom={3} width={200} height={280}>
            <TradingCard art="extra-4" width={180} loader={false} />
          </Magnifier>
        </div>
      </Pos>
      <Pos x={1270} y={790}><PhoneMockup scale={0.3}><div style={{ padding: 60, color: "white", fontFamily: UI, fontSize: 40 }}>Phone</div></PhoneMockup></Pos>
      <Pos x={1420} y={800}><LaptopMockup scale={0.2}><div style={{ padding: 80, color: "white", fontFamily: UI, fontSize: 80 }}>Laptop</div></LaptopMockup></Pos>
      <Cursor x={1800} y={900} click={0.4} />
      <TapRipple x={1700} y={1000} progress={0.4} />
      <RingPing x={1850} y={1010} progress={0.5} />
      <Burst x={1700} y={760} count={20} seed="kit" progress={0.5} distance={80} />
      <ParticleField count={30} seed="kit" frame={frame} mode="stream" area={{ x: 0, y: 1040, w: 1920, h: 30 }} />
      <LightSweep progress={0.15} width={200} />
      <GlobalOverlay />
    </AbsoluteFill>
  );
};

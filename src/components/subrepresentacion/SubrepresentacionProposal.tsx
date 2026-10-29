import ClosingCard from './ClosingCard'
import CompositionChart from './CompositionChart'
import MechanismSection from './MechanismSection'
import ProcessTimeline from './ProcessTimeline'
import ProposalHeader from './ProposalHeader'
import StatutesAccordion from './StatutesAccordion'
import SummaryCards from './SummaryCards'
import TerritoryBarsChart from './TerritoryBarsChart'
import TerritoryDetail from './TerritoryDetail'
import VoteCalculator from './VoteCalculator'

export default function SubrepresentacionProposal() {
  return (
    <div id="subrepresentacion" className="scroll-mt-24 space-y-6 md:space-y-8">
      <ProposalHeader />
      <SummaryCards />
      <MechanismSection />
      <div className="grid gap-6 lg:grid-cols-2">
        <TerritoryBarsChart />
        <CompositionChart />
      </div>
      <TerritoryDetail />
      <VoteCalculator />
      <div className="grid gap-6 lg:grid-cols-2">
        <StatutesAccordion />
        <ProcessTimeline />
      </div>
      <ClosingCard />
    </div>
  )
}

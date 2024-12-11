import React, { useMemo } from 'react';
import useReportStore from '../../../store/reportStore';
import ReportHeader from './ReportHeader';
import DamageTable from './DamageTable';
import SummaryCards from './SummaryCards';

function ReportContent() {
  const { reportData, loading, error } = useReportStore();

  const summary = useMemo(() => {
    if (!reportData?.assessments) return null;

    const repairs = reportData.assessments.filter(a => a.RepairReplaceID === 0);
    const replacements = reportData.assessments.filter(a => a.RepairReplaceID === 1);
    
    return {
      totalDamages: reportData.assessments.length,
      uniqueParts: new Set(reportData.assessments.map(a => a.CarPartMasterID)).size,
      totalImages: new Set(reportData.assessments.map(a => a.ImageName)).size,
      repairs: {
        count: repairs.length,
        cost: repairs.reduce((sum, a) => sum + (a.ActualCostRepair || 0), 0)
      },
      replacements: {
        count: replacements.length,
        cost: replacements.reduce((sum, a) => sum + (a.ActualCostRepair || 0), 0)
      },
      totalCost: reportData.totalCost
    };
  }, [reportData]);

  const groupedAssessments = useMemo(() => {
    if (!reportData?.assessments) return [];
    
    const groups = {};
    reportData.assessments.forEach(assessment => {
      if (!groups[assessment.ImageName]) {
        groups[assessment.ImageName] = [];
      }
      groups[assessment.ImageName].push(assessment);
    });
    
    return Object.entries(groups).map(([imageName, damages]) => ({
      imageName,
      damages
    }));
  }, [reportData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Loading report data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (!reportData || !reportData.assessments?.length || !summary) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No damage data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReportHeader referenceNo={reportData.referenceNo} summary={summary} />
      <DamageTable groupedAssessments={groupedAssessments} totalCost={reportData.totalCost} />
      <SummaryCards summary={summary} />
    </div>
  );
}

export default ReportContent;
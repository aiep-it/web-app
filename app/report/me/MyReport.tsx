'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardBody, CardHeader, Divider, Button, Spinner, Skeleton } from '@heroui/react';
import toast from 'react-hot-toast';

import ChartsSection from '@/components/Report/ChartsSection';
import ExerciseTable from '@/components/Report/ExerciseTable';
import Overview from '@/components/Report/Overview';
import VocabTable from '@/components/Report/VocabTable';

import { getSelfReport, getUserReport } from '@/services/report';
import { ExerciseReportItem, ReportData, VocabReportItems } from '@/services/types/report';

interface MyReportProps {
  stdId?: string; // id của học sinh cần xem
}

type ExerciseRow = ExerciseReportItem & {
  topicId: string;
  topicName: string;
  date: string;
  attemptedAt: string;
  content: string;
};

const MyReport = ({ stdId }: MyReportProps) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchReport = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const res = stdId ? await getUserReport(stdId) : await getSelfReport();

      if (signal?.aborted) return;
      if (res) setReportData(res);
      else throw new Error('Fail to fetch Report');
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      const msg = err?.message || 'Có lỗi xảy ra khi tải báo cáo';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [stdId]);

  useEffect(() => {
    const c = new AbortController();
    fetchReport(c.signal);
    return () => c.abort();
  }, [fetchReport]);

  const fmtDate = useCallback((iso?: string | Date) => {
    if (!iso) return '';
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    return new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  }, []);

  const exercises = useMemo<ExerciseRow[]>(() => {
    if (!reportData) return [];
    const items = reportData.topics?.flatMap((topic) =>
      (topic.exerciseResults?.items || []).map((item) => ({
        topicId: topic.topicId,
        topicName: topic.topicName,
        date: fmtDate(item.attemptedAt),
        attemptedAt: item.attemptedAt,
        exerciseId: item.exerciseId,
        score: item.score ?? 0,
        content: item.content ?? '',
      })),
    ) || [];
    return items.sort((a, b) => new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime());
  }, [reportData, fmtDate]);

  const vocabs: VocabReportItems[] = useMemo(() => {
    if (!reportData) return [];
    return reportData.topics?.flatMap((t) => t.vocabProgress?.items || []) || [];
  }, [reportData]);

  const downloadCSV = (rows: string[][], filename: string) => {
    const csv = rows.map(r => r.map(cell => {
      const s = String(cell ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportExercises = () => {
    if (!exercises.length) return toast('Không có dữ liệu bài tập để xuất');
    const header = ['Topic Name', 'Exercise ID', 'Attempted At', 'Date', 'Score', 'Content'];
    const rows = exercises.map(e => [e.topicName, e.exerciseId, String(e.attemptedAt ?? ''), e.date ?? '', String(e.score ?? 0), e.content ?? '']);
    downloadCSV([header, ...rows], stdId ? `student_${stdId}_exercises.csv` : 'my_exercises.csv');
  };

  const exportVocabs = () => {
    if (!vocabs.length) return toast('Không có dữ liệu từ vựng để xuất');
    const header = ['Word', 'Status', 'Last Updated', 'Note'];
    const rows = vocabs.map((v: any) => [v.word ?? v.term ?? '', v.status ?? v.mastery ?? '', fmtDate(v.updatedAt), v.note ?? '']);
    downloadCSV([header, ...rows], stdId ? `student_${stdId}_vocabs.csv` : 'my_vocabs.csv');
  };

  const title = stdId ? 'Report for Student' : 'My Report';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="flat" onPress={exportVocabs} isDisabled={!vocabs.length || loading}>Export Vocab CSV</Button>
            <Button size="sm" variant="flat" onPress={exportExercises} isDisabled={!exercises.length || loading}>Export Exercises CSV</Button>
            <Button size="sm" color="primary" onPress={() => fetchReport()} isLoading={loading} startContent={loading ? <Spinner size="sm" /> : null}>
              {loading ? 'Đang tải' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {loading && !reportData ? (
            <div className="space-y-3"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-24 w-full" /></div>
          ) : errorMsg ? (
            <div className="text-danger text-sm">{errorMsg}</div>
          ) : reportData ? (
            <>
              <Overview data={reportData.overview} />
              <Divider className="my-6" />
              <ChartsSection data={reportData} barChartData={exercises} />
              <Divider className="my-6" />
              {vocabs.length ? <VocabTable vocabItems={vocabs} /> : <div className="text-default-500 text-sm">Không có dữ liệu từ vựng.</div>}
              <Divider className="my-6" />
              {exercises.length ? <ExerciseTable exerciseItems={exercises} /> : <div className="text-default-500 text-sm">Không có dữ liệu bài tập.</div>}
            </>
          ) : (
            <div className="text-default-500 text-sm">Chưa có dữ liệu báo cáo.</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MyReport;

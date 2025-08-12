import { getClassReport, getSelfReport } from '@/services/report';
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';
import { set } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ClassReportProps {
  classId: string;
}

interface OverviewCardProps {
  title: string;
  value: string;
  icon: string;
}
const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, icon }) => (
  <Card>
    <CardBody>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-small text-default-500">{title}</p>
          <p className="text-3xl font-semibold mt-1">{value}%</p>
        </div>
        <Icon icon={icon} className="text-4xl text-primary" />
      </div>
    </CardBody>
  </Card>
);
const ClassReport: React.FC<ClassReportProps> = ({ classId }) => {
  const [studentsReport, setStudentsReport] = React.useState<any[]>([]);
  const [overallProgress, setOverallProgress] = React.useState({
    completedTopics: 0,
    totalTopics: 0,
    exercisesAttempted: 0,
    correctExercises: 0,
  });
  const [overallTopicCompletion, setOverallTopicCompletion] = React.useState(0);
  const [overallExerciseSuccess, setOverallExerciseSuccess] = React.useState(0);
  const fetchSelfReport = async () => {
    const res = await getClassReport(classId);

    if (res) {
      console.log('Class Report Data:', res);
      if (res) {
        const { studentsReport } = res;
        setStudentsReport(studentsReport);
      }
    } else {
      toast.error('Fail to fetch Report');
    }
  };

  useEffect(() => {
    fetchSelfReport();
  }, []);

  useEffect(() => {
    if (studentsReport && studentsReport.length > 0) {
      const overallProgressData = studentsReport.reduce(
        (acc, student) => {
          acc.completedTopics += student.progressSummary.completedTopicsCount;
          acc.totalTopics += student.progressSummary.totalTopicsInClass;
          acc.exercisesAttempted +=
            student.progressSummary.totalExercisesAttempted;
          acc.correctExercises += student.progressSummary.correctExercisesCount;
          return acc;
        },
        {
          completedTopics: 0,
          totalTopics: 0,
          exercisesAttempted: 0,
          correctExercises: 0,
        },
      );

      const overallTopicCompletionData =
        (overallProgress.completedTopics / overallProgress.totalTopics) * 100 ||
        0;
      const overallExerciseSuccessData =
        (overallProgress.correctExercises /
          overallProgress.exercisesAttempted) *
          100 || 0;

      setOverallProgress(overallProgressData);
      setOverallTopicCompletion(overallTopicCompletionData);
      setOverallExerciseSuccess(overallExerciseSuccessData);
    }
  }, [studentsReport]);

  return (
    <div>
      <div className="min-h-screen bg-background p-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Class Report
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <OverviewCard
            title="Overall Topic Completion"
            value={overallTopicCompletion.toFixed(1)}
            icon="lucide:book-open"
          />
          <OverviewCard
            title="Overall Exercise Success Rate"
            value={overallExerciseSuccess.toFixed(1)}
            icon="lucide:check-circle"
          />
        </div>

        <Card className="mb-8">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Student Progress</h2>
          </CardHeader>
          <CardBody>
            <Table removeWrapper aria-label="Student progress table">
              <TableHeader>
                <TableColumn>STUDENT</TableColumn>
                <TableColumn>TOPICS COMPLETED</TableColumn>
                <TableColumn>EXERCISES ATTEMPTED</TableColumn>
                <TableColumn>SUCCESS RATE</TableColumn>
              </TableHeader>
              <TableBody>
                {studentsReport.map((student) => (
                  <TableRow key={student.student.id}>
                    <TableCell>{`${student.student.firstName} ${student.student.lastName}`}</TableCell>
                    <TableCell>
                        
                      <div className="flex items-center gap-2">
                        <span>
                          {student.progressSummary.completedTopicsCount}
                        </span>
                        <Progress
                          size="sm"
                          value={
                            student.progressSummary.topicCompletionPercentage
                          }
                          className="max-w-md"
                        />
                        <span className="text-small text-default-400">
                          {student.progressSummary.topicCompletionPercentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.progressSummary.totalExercisesAttempted}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${student.progressSummary.exerciseSuccessRate >= 70 ? 'text-success' : 'text-danger'}`}
                      >
                        {student.progressSummary.exerciseSuccessRate}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ClassReport;

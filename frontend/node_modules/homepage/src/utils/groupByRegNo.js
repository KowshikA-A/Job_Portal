// groupByRegNo.js

export function groupByRegNo(students) {
    return students.reduce((acc, student) => {
        const existing = acc.find(s => s.Reg_No === student.Reg_No);
        if (existing) {
            existing.Companies.push(student.Company);
            existing.Statuses.push(student.ApplicationStatus);
        } else {
            acc.push({
                ...student,
                Companies: [student.Company],
                Statuses: [student.ApplicationStatus]
            });
        }
        return acc;
    }, []);
}
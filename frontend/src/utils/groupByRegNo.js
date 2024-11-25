export function groupByRegNo(students) {
    return students.reduce((acc, student) => {
        const regNo = student.Reg_No; // Use Reg_No as the key to group students

        // Check if this student has already been added to the accumulator
        if (!acc[regNo]) {
            // If not, initialize an entry for the student with basic details and an empty Applications array
            acc[regNo] = {
                Name: student.Name,
                Reg_No: student.Reg_No,
                Year: student.Year,
                School: student.School,
                Applications: [] // Store applications for this student
            };
        }

        // Add the student's application details to the Applications array
        acc[regNo].Applications.push({
            Company: student.Company,
            ApplicationStatus: student.ApplicationStatus,
            Category: student.Category,
            CTC: student.CTC
        });

        return acc; // Return the updated accumulator
    }, {}); // Start with an empty object to accumulate grouped data
}
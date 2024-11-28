import { useState, useEffect } from 'react';
import { InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import { Student } from '../structures/Types';

interface SearchProps {
  students: Student[];
  setFilteredStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const Search: React.FC<SearchProps> = ({ students, setFilteredStudents }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students, setFilteredStudents]);

  return (
    <div className="search-container">
      <InputGroup>
        <InputGroup.Text id="basic-addon1">
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <FormControl
          placeholder="Search by Student Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search"
          aria-describedby="basic-addon1"
        />
      </InputGroup>

      {searchQuery && (
        <ListGroup className="suggestions-list">
          {students
            .filter((student) =>
              student.name.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .map((student) => (
              <ListGroup.Item
                key={student.id}
                action
                onClick={() => {
                  setSearchQuery(student.name);
                  setFilteredStudents([student]);
                }}
              >
                {student.name}
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Search;

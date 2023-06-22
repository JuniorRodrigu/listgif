import Link from "next/link";
import { useState } from 'react';
import styles from './styles.module.css'

type Props = {
    mainColor: string;
    onButtonClick: () => void;
    onSearch: (searchValue: string) => void;

}

export default function SearchInput  ({ mainColor, onSearch }: Props)  {
    const [focused, setFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.code === 'Enter') {
            onSearch(searchValue);
        }
    }

    return (
        <div
            className={styles.container}
            style={{ borderColor: focused ? mainColor : '#ffffff' }}>
            <div
                className={styles.button}
                onClick={() => onSearch(searchValue)}
            ></div>
            <input
                type="text"
                className={styles.input}
                placeholder="digite o nome do produto"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyUp={handleKeyUp}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    );

}
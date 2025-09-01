'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './SearchBar.module.css';
import { useRouter } from 'next/navigation';
import { School, UserSearch, Undo2 } from 'lucide-react';
import { MagnifyingGlass, ListMagnifyingGlass } from "@phosphor-icons/react";
import { useTranslation } from 'react-i18next';
import { getSubjectTranslation } from '../utils/subjectUtils';
import { createPortal } from 'react-dom';

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const SearchBar = ({ homepage, className, ...otherprops }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ dbResults: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState('teachers');
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            if (!homepage) {
                setIsMobile(window.innerWidth <= 920);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        // Fetch schools (to display under teacher name)
        const fetchSchools = async () => {
            try {
                const response = await fetch('/api/schools');
                const data = await response.json();
                setSchools(data.dbResults || []);
            } catch (err) {
                console.error('Error fetching schools:', err);
            }
        };

        fetchSchools();
        // Cleanup event listener
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (!isMobile && searchRef.current && !searchRef.current.contains(event.target)) {
                setIsResultsVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobile]);

    const searchRef = useRef(null);
    const errorMessages = t('SearchBar.errorMessages', { returnObjects: true });
    const noResultsMessages = t('SearchBar.noResultsMessages', { returnObjects: true });
    const loadingMessages = t('SearchBar.loadingMessages', { returnObjects: true });

    function getRandomMessage(messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }

    function getRandomErrorMessage() {
        return getRandomMessage(errorMessages);
    }

    function getRandomNoResultsMessage(query) {
        const message = getRandomMessage(noResultsMessages);
        return message.replace('{query}', query);
    }

    function getRandomLoadingMessage() {
        return getRandomMessage(loadingMessages);
    }

    const performSearch = async (q) => {
        setIsLoading(true);
        setError(null);

        try {
            // Dynamically choose the API endpoint based on search type
            let endpoint = searchType === 'teachers' ? '/api/teachers' : '/api/schools';
            if (searchType === 'teachers' && selectedSchool) {
                endpoint += `?q=${encodeURIComponent(q)}&sid=${selectedSchool}`;
            } else {
                endpoint += `?q=${encodeURIComponent(q)}`;
            }

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();

            //sort alphabetically
            data.dbResults.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                } else {
                    return 0;
                }
            });

            setResults(data);
        } catch (err) {
            setError(getRandomErrorMessage())
            console.error('Search error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedPerformSearch = useCallback(
        debounce((q) => {
            performSearch(q);
        }, 500),
        [searchType, selectedSchool]
    );
    const toggleSearchType = () => {
        setSearchType(prevType => prevType === 'teachers' ? 'schools' : 'teachers');
        setResults({ dbResults: [] });
        setQuery('');
        //setSelectedSchool('');
    };

    const handleUndo = () => {
        setIsMobileSearchOpen(false);
        setIsResultsVisible(false);
    };

    const renderSearchContent = () => (
        <div ref={searchRef}>
            <div className={styles['search-input-container']}>
                <div className={`${isMobile ? styles.mobile : ''} ${styles['search-toggle-container']}`}>
                    <label className={styles['search-toggle-button']}>
                        <input
                            type="checkbox"
                            checked={searchType === 'schools'}
                            onChange={toggleSearchType}
                            aria-label={t('SearchBar.toggleSearchType')}
                        />
                        <div className={styles.slider}>
                            <div className={styles.circle}>
                                {searchType === 'schools' ? (
                                    <School className={styles['search-icon']} />
                                ) : (
                                    <UserSearch className={styles['search-icon']} />
                                )}
                            </div>
                        </div>
                    </label>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsResultsVisible(true);
                        if (e.target.value.trim()) {
                            debouncedPerformSearch(e.target.value);
                        } else {
                            setResults({ dbResults: [] });
                        }
                    }}
                    onFocus={() => setIsResultsVisible(true)}
                    className={styles['search-bar']}
                    placeholder={t('SearchBar.placeholder', { searchType: t(`SearchBar.searchTypes.${searchType}`) })}
                    style={{ paddingRight: searchType === 'schools' ? '50px' : '15px' }} // Add padding for button
                />
                {searchType === 'schools' && (
                    <button
                        className={styles['school-list-button']}
                        onClick={() => {
                            router.push('/schoollist');
                            if (isMobile) {
                                setIsMobileSearchOpen(false);  // Close mobile search
                            }
                        }}
                        aria-label={t('SearchBar.openSchoolList')}
                    >
                        <ListMagnifyingGlass weight="duotone" className={styles['list-icon']} />
                    </button>
                )}
            </div>

            {query.trim() && isResultsVisible && (
                <div className={`${isMobile ? styles.mobile : ''} ${styles['search-results']} ${styles['fade-in']}`}>
                    {isLoading ? (
                        <div className={styles['loading']}>{getRandomLoadingMessage()}</div>
                    ) : error ? (
                        <div className={styles['error']}>{error}</div>
                    ) : (results.dbResults.length > 0) ? (
                        <div>
                            <div className={styles['results-section-header']}>
                                <p>{t(`SearchBar.resultHeader.${searchType}`)}</p>
                                {searchType === 'teachers' && selectedSchool && (
                                    <span> - {schools.find(s => s.schoolId == selectedSchool)?.name || t('SearchBar.selectedSchool')}</span>
                                )}
                            </div>
                            {results.dbResults.map((result) => (
                                <div
                                    key={result._id}
                                    className={styles['result-item']}
                                    onClick={() => {
                                        setIsResultsVisible(false);
                                        if (isMobile) {
                                            setIsMobileSearchOpen(false);
                                        }
                                        setQuery(''); // Clear the search bar
                                        searchType === 'teachers'
                                            ? router.push(`/${result.schoolId}/${searchType}#${result._id}`).then(() => {
                                                setTimeout(() => {
                                                    const element = document.getElementById(result._id);
                                                    if (element) {
                                                        const yOffset = -50;
                                                        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                                    }
                                                }, 100);
                                            })
                                            : router.push(`/${result.schoolId}`);
                                    }}
                                >
                                    <h3 className={styles['teacher-name']}>{result.name}</h3>
                                    <p className={styles['teacher-info']}>
                                        {searchType === 'teachers'
                                            ? (
                                                <>
                                                    {`${result.rating?.toFixed(1) || t('SearchBar.notAvailable')} • ${getSubjectTranslation(result.role)} • `}
                                                    <b>{schools.find(s => s.schoolId == result.schoolId)?.name}</b>
                                                </>
                                            )
                                            : result.geolocation
                                        }
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles['no-results']}>
                            {getRandomNoResultsMessage(query)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className={`${isMobile ? styles.mobile : ''} ${styles['search-wrapper']} ${className ? className : ''}`} {...otherprops}>
            {/* Desktop search bar */}
            {!isMobile ? (
                renderSearchContent()
            ) : (
                <>
                    {/* Mobile search button */}
                    <button
                        className={styles['mobile-search-button']}
                        onClick={() => setIsMobileSearchOpen(true)}
                    >
                        <MagnifyingGlass weight="duotone" className={styles['search-icon']} />
                    </button>
                    {/* Mobile search overlay */}
                    {createPortal(
                        <div
                            className={`${styles['mobile-search-overlay']} ${isMobileSearchOpen ? styles['active'] : ''}`}
                        >
                            <button className={styles['undo-button']} onClick={handleUndo}>
                                <Undo2 size={24} />
                            </button>
                            {renderSearchContent()}
                        </div>,
                        document.body
                    )}
                </>
            )}
        </div>
    );
};

export default SearchBar;
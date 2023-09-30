'use client'

const SearchBar = () => {
    const handleSearch = (e) => {
        
    }
    return (
        <input 
            type="text" 
            placeholder="Search" 
            onKeyDown={handleSearch}
            className="input border-2 border-gray-200 input-bordered w-full bg-white" 
        />
    )
}

export default SearchBar

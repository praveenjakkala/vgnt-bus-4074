import React from 'react';

const SeatLayout = ({ occupiedSeats = [], onSeatClick = () => { } }) => {
    const rows = 12;
    const seatsPerRow = 4;

    const getSeatId = (row, pos) => {
        const side = pos <= 2 ? 'L' : 'R';
        const num = pos <= 2 ? pos : pos - 2;
        return `R${row}-${side}${num}`;
    };

    return (
        <div className="font-mono text-xs">
            {/* Driver Seat */}
            <div className="flex justify-end mb-4">
                <div className="bg-vignan-blue text-white px-3 py-1 rounded-lg text-xs font-bold">
                    🚌 Driver
                </div>
            </div>

            {/* Seats Grid */}
            <div className="space-y-2">
                {Array.from({ length: rows }, (_, rowIdx) => {
                    const rowNum = rowIdx + 1;
                    return (
                        <div key={rowNum} className="flex items-center justify-center space-x-1">
                            {/* Left pair */}
                            <div className="flex space-x-1">
                                {[1, 2].map(pos => {
                                    const seatId = getSeatId(rowNum, pos);
                                    const isOccupied = occupiedSeats.includes(seatId);
                                    return (
                                        <button
                                            key={seatId}
                                            onClick={() => onSeatClick(seatId)}
                                            className={`w-8 h-8 rounded-md text-[9px] font-bold border-2 transition-all ${isOccupied
                                                    ? 'bg-vignan-blue text-white border-vignan-blue'
                                                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-vignan-blue'
                                                }`}
                                            title={seatId}
                                        >
                                            {rowNum}{pos === 1 ? 'L' : 'R'}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Aisle */}
                            <div className="w-4 text-center text-gray-300 text-xs">{rowNum}</div>
                            {/* Right pair */}
                            <div className="flex space-x-1">
                                {[3, 4].map(pos => {
                                    const seatId = getSeatId(rowNum, pos);
                                    const isOccupied = occupiedSeats.includes(seatId);
                                    return (
                                        <button
                                            key={seatId}
                                            onClick={() => onSeatClick(seatId)}
                                            className={`w-8 h-8 rounded-md text-[9px] font-bold border-2 transition-all ${isOccupied
                                                    ? 'bg-vignan-blue text-white border-vignan-blue'
                                                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-vignan-blue'
                                                }`}
                                            title={seatId}
                                        >
                                            {rowNum}{pos === 3 ? 'L' : 'R'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-4 mt-4 text-xs">
                <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-vignan-blue rounded"></div>
                    <span className="text-gray-500">Occupied</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded"></div>
                    <span className="text-gray-500">Available</span>
                </div>
            </div>
        </div>
    );
};

export default SeatLayout;

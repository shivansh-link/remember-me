// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./chainlink/KeeperCompatible.sol";

contract pmCrudCon is KeeperCompatibleInterface {
    struct dataRecord {
        string gameRecord;
        uint256 gameID;
        uint256 empID;
        string gameStart;
    }

    mapping(uint256 => dataRecord) private dataBase9;
    uint256[] private db9Index;

    event LogNewEmp(
        string gameRecord,
        uint256 gameID,
        string gameStart,
        uint256 empID
    );
    event LogUpdateEmpSal(string gameRecord, uint256 gameID);
    event LogDeleteEmp(string gameRecord, uint256 empIdIndex);

    function isEmp(uint256 empIDck) public view returns (bool isIndeed) {
        if (db9Index.length == 0) return false;
        return (db9Index[empIDck] == empIDck);
    }

    function insertEmp(
        string memory gameRecord,
        uint256 gameID,
        uint256 empID
    ) public {
        if (isEmp(empID)) revert("duplicate");
        dataBase9[empID].gameRecord = gameRecord;
        dataBase9[empID].gameID = gameID;
        emit LogNewEmp(
            dataBase9[empID].gameRecord,
            dataBase9[empID].gameID,
            dataBase9[empID].gameStart,
            empID
        );
    }

    function getEmpData(uint256 empIDck)
        public
        view
        returns (string memory gameRecord, uint256 gameID)
    {
        if (!isEmp(empIDck)) return ("not found", 0);
        return (dataBase9[empIDck].gameRecord, dataBase9[empIDck].gameID);
    }

    function updategameID(uint256 empID, uint256 newSalary)
        public
        returns (bool success)
    {
        if (!isEmp(empID)) revert("not found");
        dataBase9[empID].gameID = newSalary;
        emit LogUpdateEmpSal(
            dataBase9[empID].gameRecord,
            dataBase9[empID].gameID
        );
        return true;
    }

    function getEmpCount()
        public
        view
        returns (uint256 count, string memory retString)
    {
        return (db9Index.length, "Hello Prithwis - v1.0 ");
    }

    function deleteEmp(uint256 empID) public {
        if (!isEmp(empID)) revert("not found");
        string storage gameRecordToDelete = dataBase9[empID].gameRecord;
        uint256 rowToDelete = dataBase9[empID].empID;
        uint256 keyToMove = db9Index[db9Index.length - 1];
        db9Index[rowToDelete] = keyToMove;
        emit LogDeleteEmp(gameRecordToDelete, rowToDelete);
    }

    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata performData)
        external
        payable
        override
    {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            address(this).transfer(dataRecord["gameID"]);
        }
    }
}

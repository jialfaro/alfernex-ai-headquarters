// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AlfernexHQ",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .executable(
            name: "AlfernexHQ",
            targets: ["AlfernexHQ"]
        )
    ],
    targets: [
        .executableTarget(
            name: "AlfernexHQ",
            path: "AlfernexHQ"
        )
    ]
)

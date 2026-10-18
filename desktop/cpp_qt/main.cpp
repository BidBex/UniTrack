#include <QApplication>
#include <QMainWindow>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QPushButton>
#include <QTableWidget>
#include <QHeaderView>
#include <QFileDialog>
#include <QMessageBox>
#include <QFile>
#include "CalendarViewModel.hpp"

class MainWindow : public QMainWindow {
    Q_OBJECT
public:
    MainWindow(QWidget* parent = nullptr) : QMainWindow(parent), m_vm(new CalendarViewModel(this)) {
        setWindowTitle("UniTrack - University Academic Calendar (C++ / Qt6)");
        resize(1000, 650);

        auto central = new QWidget(this);
        setCentralWidget(central);
        auto layout = new QVBoxLayout(central);

        auto headerLayout = new QHBoxLayout();
        auto title = new QLabel("🎓 <b>UniTrack C++</b> | University Week Timetable", this);
        title->setStyleSheet("font-size: 16px; color: #312e81; font-weight: bold;");

        auto weekInfo = m_vm->getAcademicWeekInfo();
        m_weekBadge = new QLabel(weekInfo.label, this);
        m_weekBadge->setStyleSheet("background: #4f46e5; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold;");

        auto btnLoad = new QPushButton("📂 Open JSON", this);
        auto btnSave = new QPushButton("💾 Export JSON", this);

        connect(btnLoad, &QPushButton::clicked, this, &MainWindow::loadJson);
        connect(btnSave, &QPushButton::clicked, this, &MainWindow::saveJson);

        headerLayout->addWidget(title);
        headerLayout->addSpacing(16);
        headerLayout->addWidget(m_weekBadge);
        headerLayout->addStretch();
        headerLayout->addWidget(btnLoad);
        headerLayout->addWidget(btnSave);
        layout->addLayout(headerLayout);

        m_table = new QTableWidget(this);
        m_table->setColumnCount(5);
        m_table->setHorizontalHeaderLabels({"Day", "Time", "Type", "Course & Title", "Room & Professor"});
        m_table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
        layout->addWidget(m_table);

        refreshTable();
    }

private slots:
    void loadJson() {
        QString path = QFileDialog::getOpenFileName(this, "Open UniTrack Schedule", "", "JSON Files (*.json)");
        if (path.isEmpty()) return;

        QFile file(path);
        if (file.open(QIODevice::ReadOnly)) {
            if (m_vm->importFromJson(file.readAll())) {
                refreshTable();
                QMessageBox::information(this, "Success", "Schedule loaded successfully!");
            } else {
                QMessageBox::critical(this, "Error", "Invalid JSON schedule format.");
            }
        }
    }

    void saveJson() {
        QString path = QFileDialog::getSaveFileName(this, "Save UniTrack Schedule", "unitrack_schedule.json", "JSON Files (*.json)");
        if (path.isEmpty()) return;

        QFile file(path);
        if (file.open(QIODevice::WriteOnly)) {
            file.write(m_vm->exportToJson());
            QMessageBox::information(this, "Saved", "Schedule exported successfully!");
        }
    }

    void refreshTable() {
        auto info = m_vm->getAcademicWeekInfo();
        m_weekBadge->setText(info.label);
        m_table->setRowCount(0);

        int row = 0;
        for (const auto& c : m_vm->classes) {
            if (!m_vm->isClassActive(c, info.weekNumber, info.parity)) continue;
            m_table->insertRow(row);
            m_table->setItem(row, 0, new QTableWidgetItem(c.day));
            m_table->setItem(row, 1, new QTableWidgetItem(QString("%1 - %2").arg(c.startTime, c.endTime)));
            m_table->setItem(row, 2, new QTableWidgetItem(c.type.toUpper()));
            m_table->setItem(row, 3, new QTableWidgetItem(QString("[%1] %2").arg(c.code, c.title)));
            m_table->setItem(row, 4, new QTableWidgetItem(QString("%1 (%2)").arg(c.room, c.professor)));
            row++;
        }
    }

private:
    CalendarViewModel* m_vm;
    QLabel* m_weekBadge;
    QTableWidget* m_table;
};

int main(int argc, char* argv[]) {
    QApplication app(argc, argv);
    MainWindow window;
    window.show();
    return app.exec();
}

#include "main.moc"

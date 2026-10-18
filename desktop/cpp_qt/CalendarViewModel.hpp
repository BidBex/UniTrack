#pragma once

#include <QObject>
#include <QString>
#include <QDate>
#include <QDateTime>
#include <QVector>
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonDocument>
#include <algorithm>

struct VacationPeriod {
    QString id;
    QString name;
    QDate startDate;
    QDate endDate;
    bool pauseWeekNumbering{true};
};

struct ClassEvent {
    QString id;
    QString title;
    QString code;
    QString type; // "lecture", "laboratory", "seminary"
    QString day;  // "Monday", ...
    QString startTime; // "HH:MM"
    QString endTime;
    QString room;
    QString recurrence; // "all", "odd", "even"
    QString color;
    QString professor;
};

struct CountdownItem {
    QString id;
    QString title;
    QString category; // "exam", "assignment", "project"
    QString courseCode;
    QDateTime startDate;
    QDateTime dueDate;
    int weightPercent{0};
    bool completed{false};
};

class CalendarViewModel : public QObject {
    Q_OBJECT
public:
    explicit CalendarViewModel(QObject* parent = nullptr) : QObject(parent) {
        semesterStart = QDate(2026, 10, 5);
        totalWeeks = 14;
        initialWeekParity = "odd";
    }

    struct AcademicWeekInfo {
        int weekNumber{1};
        QString parity{"odd"};
        bool isVacation{false};
        QString label;
    };

    AcademicWeekInfo getAcademicWeekInfo(const QDate& date = QDate::currentDate()) const {
        AcademicWeekInfo info;
        qint64 diffDays = semesterStart.daysTo(date);

        if (diffDays < 0) {
            info.weekNumber = 1;
            info.parity = initialWeekParity;
            info.label = QString("Pre-Semester (Starts %1)").arg(semesterStart.toString(Qt::ISODate));
            return info;
        }

        // Vacation pause calculation
        qint64 pausedDays = 0;
        for (const auto& vac : vacations) {
            if (date >= vac.startDate && date <= vac.endDate) {
                info.isVacation = true;
                info.label = QString("🌴 %1").arg(vac.name);
            }
            if (vac.pauseWeekNumbering && date >= vac.startDate) {
                QDate effEnd = (date < vac.endDate) ? date : vac.endDate;
                pausedDays += vac.startDate.daysTo(effEnd) + 1;
            }
        }

        qint64 effectiveDays = std::max<qint64>(0, diffDays - pausedDays);
        int rawWeek = static_cast<int>(effectiveDays / 7) + 1;
        info.weekNumber = std::clamp(rawWeek, 1, totalWeeks);

        bool initialOdd = (initialWeekParity == "odd");
        bool isOdd = initialOdd ? (info.weekNumber % 2 != 0) : (info.weekNumber % 2 == 0);
        info.parity = isOdd ? "odd" : "even";

        if (!info.isVacation) {
            info.label = QString("Week %1 (%2 Week)").arg(info.weekNumber).arg(isOdd ? "Odd" : "Even");
        }
        return info;
    }

    bool isClassActive(const ClassEvent& c, int weekNum, const QString& parity) const {
        if (c.recurrence == "all") return true;
        return c.recurrence == parity;
    }

    QByteArray exportToJson() const {
        QJsonObject root;
        root["version"] = "1.0.0";
        root["appName"] = "UniTrack Qt";

        QJsonObject semObj;
        semObj["startDate"] = semesterStart.toString(Qt::ISODate);
        semObj["totalWeeks"] = totalWeeks;
        semObj["initialWeekParity"] = initialWeekParity;
        root["semester"] = semObj;

        QJsonArray classArr;
        for (const auto& c : classes) {
            QJsonObject o;
            o["id"] = c.id;
            o["title"] = c.title;
            o["code"] = c.code;
            o["type"] = c.type;
            o["day"] = c.day;
            o["startTime"] = c.startTime;
            o["endTime"] = c.endTime;
            o["room"] = c.room;
            o["recurrence"] = c.recurrence;
            o["color"] = c.color;
            o["professor"] = c.professor;
            classArr.append(o);
        }
        root["classes"] = classArr;

        return QJsonDocument(root).toJson(QJsonDocument::Indented);
    }

    bool importFromJson(const QByteArray& data) {
        QJsonParseError err;
        auto doc = QJsonDocument::fromJson(data, &err);
        if (doc.isNull() || !doc.isObject()) return false;

        auto root = doc.object();
        if (root.contains("semester")) {
            auto s = root["semester"].toObject();
            semesterStart = QDate::fromString(s["startDate"].toString(), Qt::ISODate);
            totalWeeks = s["totalWeeks"].toInt(14);
            initialWeekParity = s["initialWeekParity"].toString("odd");
        }

        if (root.contains("classes")) {
            classes.clear();
            for (const auto& v : root["classes"].toArray()) {
                auto o = v.toObject();
                ClassEvent c;
                c.id = o["id"].toString();
                c.title = o["title"].toString();
                c.code = o["code"].toString();
                c.type = o["type"].toString();
                c.day = o["day"].toString();
                c.startTime = o["startTime"].toString();
                c.endTime = o["endTime"].toString();
                c.room = o["room"].toString();
                c.recurrence = o["recurrence"].toString();
                c.color = o["color"].toString();
                c.professor = o["professor"].toString();
                classes.append(c);
            }
        }
        return true;
    }

    QDate semesterStart;
    int totalWeeks{14};
    QString initialWeekParity{"odd"};
    QVector<VacationPeriod> vacations;
    QVector<ClassEvent> classes;
    QVector<CountdownItem> countdowns;
};

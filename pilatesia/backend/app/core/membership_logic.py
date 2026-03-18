from fastapi import HTTPException
from sqlalchemy import text

DEFAULT_CREDITS = 0  # Yeni kayıt 0 kredi; admin panelden manuel eklenir

def get_or_create_membership(db, user_id: int):
    m = db.execute(
        text("""
            SELECT id, user_id, status, remaining_cred
            FROM memberships
            WHERE user_id = :uid
            LIMIT 1
        """),
        {"uid": user_id}
    ).fetchone()

    if m:
        return m

    # yoksa oluştur (unique user_id yüzünden tek kayıt olur)
    db.execute(
        text("""
            INSERT INTO memberships (user_id, status, remaining_cred)
            VALUES (:uid, 'active', :cred)
        """),
        {"uid": user_id, "cred": DEFAULT_CREDITS}
    )
    db.commit()

    m = db.execute(
        text("""
            SELECT id, user_id, status, remaining_cred
            FROM memberships
            WHERE user_id = :uid
            LIMIT 1
        """),
        {"uid": user_id}
    ).fetchone()

    return m


def consume_credit_or_400(db, user_id: int, amount: int = 1):
    # kredi yeterli mi? yeterliyse düş
    result = db.execute(
        text("""
            UPDATE memberships
            SET remaining_cred = remaining_cred - :amt
            WHERE user_id = :uid
              AND status = 'active'
              AND remaining_cred >= :amt
        """),
        {"uid": user_id, "amt": amount}
    )
    if result.rowcount == 0:
        raise HTTPException(status_code=400, detail="Not enough credits")
    db.commit()


def refund_credit(db, user_id: int, amount: int = 1):
    db.execute(
        text("""
            UPDATE memberships
            SET remaining_cred = remaining_cred + :amt
            WHERE user_id = :uid
              AND status = 'active'
        """),
        {"uid": user_id, "amt": amount}
    )
    db.commit()
